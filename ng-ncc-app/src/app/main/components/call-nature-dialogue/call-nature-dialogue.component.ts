import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, of, forkJoin, Subject } from 'rxjs';
import { finalize, take, takeUntil } from 'rxjs/operators';

import { LogCallReason } from '../../../common/classes/log-call-reason.class';
import { LogCallType } from '../../../common/classes/log-call-type.class';
import { CALL_REASON } from '../../../common/constants/call-reason.constant';
import { ConfirmDialogueComponent } from '../dialogue/confirm/confirm-dialogue.component';

import { ILogCallSelection } from '../../../common/interfaces/log-call-selection';
import { ICallReasonNote } from '../../../common/interfaces/call-reason-note';
import { ICallReasonListItem } from '../../../common/interfaces/call-reason-list-item';

import { HackneyAPIService } from '../../../common/API/HackneyAPI/hackney-api.service';
import { NotesService } from '../../../common/services/notes.service';
import { ViewOnlyService } from '../../../common/services/view-only.service';

@Component({
    selector: 'app-call-nature-dialogue',
    templateUrl: './call-nature-dialogue.component.html',
    styleUrls: ['./call-nature-dialogue.component.scss']
})
export class CallNatureDialogueComponent extends ConfirmDialogueComponent implements OnInit, OnDestroy {
    @Input() show: boolean;
    @Output() showChange = new EventEmitter<boolean>();
    @Output() confirmed = new EventEmitter<void>();
    @Output() cancel = new EventEmitter<void>();

    @ViewChild('otherReasonField') otherReasonField: ElementRef;

    private _destroyed$ = new Subject<void>();

    optionOther: LogCallReason;
    saving: boolean;
    selectedType: LogCallType;
    selectedReasonIds: string[];  // a list of call reason IDs.
    selectedReasons: ICallReasonListItem[]; // used to display a list of selected call reasons with their type.
    otherReason: {[propKey: string]: string}; // contains additional text for call-type specific "other" reasons.
    callTypes: LogCallType[];
    callReasons: { [propKey: number]: LogCallReason[] };
    error: boolean;
    callReasonList: ICallReasonListItem[];


    constructor(
        private HackneyAPI: HackneyAPIService,
        private Notes: NotesService,
        private cdRef: ChangeDetectorRef,
        private ViewOnly: ViewOnlyService
    ) {
        super();
    }

    ngOnInit() {
        this.reset();

        // Fetch a list of call types and reasons from the Hackney API.
        forkJoin(
            this.HackneyAPI.getCallTypes(),
            this.HackneyAPI.getCallReasons()
        )
            .pipe(take(1))
            .subscribe(
                data => {
                    this.callTypes = data[0];
                    this.callReasons = data[1];
                    this._buildInternalCallReasonList();
                },
                () => {
                    this.error = true;
                }
            );

        // Subscribe to note addition events.
        this.Notes.noteWasAdded()
            .pipe(takeUntil(this._destroyed$))
            .subscribe(() => {
                // Preselect call reasons.
                this._preselectCallReasons();
            });
    }

    ngOnDestroy() {
        this._destroyed$.next();
    }

    /**
     * Reset the selection.
     */
    reset() {
        this.selectedType = null;
        this.selectedReasonIds = [];
        this.otherReason = {};
    }

    /**
     * Preselects call reasons in the dialogue.
     */
    private _preselectCallReasons() {
        const natures = this.Notes.getUsedCallNatures();

        this.selectedReasonIds = natures.map(
            (nature: ILogCallSelection) => nature.call_reason.id
        );
        this._mapSelectedCallReasonsToListOfReasons();

        // Record "other" call reason text, whether filled in or not.
        natures.forEach((nature: ILogCallSelection) => {
            this.otherReason[ nature.call_reason.id ] = nature.other_reason;
        });
    }

    /**
     * Creates an array of objects {selectedReasons} to display the Selected Reasons
     * by transforming the list of reason id's in selectedReasonIds array to an
     * object with the LogCallReason and the associated type
     *
     * @private
     * @memberof CallNatureDialogueComponent
     * @returns {void}
     */
    private _mapSelectedCallReasonsToListOfReasons = (): void => {
        const selectedReasons = this.selectedReasonIds.map((callReasonId: string) => {
            return this.callReasonList.find((item: ICallReasonListItem) => item.callReasonId === callReasonId);
        });

        this.selectedReasons = selectedReasons;
    }

    /**
     * Returns a list of call reasons for the currently selected call type, ordered alphabetically (ascending).
     */
    getCallTypeReasons(): LogCallReason[] {
        if (this.isCallTypeSelected()) {
            const reasons: LogCallReason[] = Array.from(this.callReasons[this.selectedType.id]);
            // We use Array.from() to create a new instance of the list of call reasons.
            // Without this we would have an ever-shrinking list of call reasons as they are selected,
            // because of the below method.
            this._separateOther(reasons);

            reasons.sort(this._sortCallReasons);

            return reasons;
        }
    }

    /**
     * Filters out a call type's "other" call reason.
     * If none exists then a dummy "other" call reason is created.
     */
    private _separateOther(reasons_list: LogCallReason[]) {
        const index = reasons_list.findIndex(
            (reason: LogCallReason) => 'Other' === reason.label
        );
        if (-1 === index) {
            // Create a "placeholder" Other call reason.
            this.optionOther = new LogCallReason(CALL_REASON.OTHER, 'Other');
        } else {
            // Use an existing "other" call reason.
            this.optionOther = reasons_list[index];
        }
        reasons_list.splice(index, 1);
    }

    /**
     * A sorting function for call reasons.
     */
    private _sortCallReasons(a: LogCallReason, b: LogCallReason) {
        // "Other" always goes to the bottom of the list.
        if ('0' === a.id || '0' === b.id) {
            return -1;
        }

        const left = a.label.toLowerCase();
        const right = b.label.toLowerCase();

        if (left < right) {
            return -1;
        } else if (left > right) {
            return 1;
        }
        return 0;
    }

    /**
     * Fires the changed event for this component.
     */
    updateSelection() {
        // see https://stackoverflow.com/a/46051865/4073160
        // The "other reason" text field is normally hidden, so the ViewChild reference will normally be undefined.
        // We can manually detect a change to the reference before setting the focus on the text field, if necessary.
        this.cdRef.detectChanges();
        if (this.isOtherReasonSelected()) {
            this._focusOtherReason();
        }
    }

    /**
     * Returns TRUE if a call type has been selected.
     */
    isCallTypeSelected(): boolean {
        return this.selectedType instanceof LogCallType;
    }

    /**
     * Returns TRUE if the specific call reason has been selected.
     */
    isReasonSelected(reason: LogCallReason) {
        return this.selectedReasonIds && this.selectedReasonIds.indexOf(reason.id) > -1;
    }

    /**
     * Returns TRUE if a call type has been selected.
     */
    isAtLeastOneReasonSelected() {
        return this.selectedReasonIds && this.selectedReasonIds.length > 0;
    }

    /**
     * Returns TRUE if "other" is selected as the call reason.
     */
    isOtherReasonSelected(): boolean {
        return this.isReasonSelected(this.optionOther);
    }

    /**
     * Set the focus on the other reason field.
     */
    private _focusOtherReason() {
        if (this.otherReasonField) {
            this.otherReasonField.nativeElement.focus();
        }
    }

    /**
     *
     */
    answerYes() {
        if (this.saving) {
            return;
        }

        this.saving = true;
        let observe;
        if (this.ViewOnly.status) {
            observe = of([]);
        } else {
            const notes = this._buildCallReasonNotes();
            observe = this.Notes.recordCallReasons(notes);
        }

        // Attempt to save the selected call reasons as notes.
        // If we're in View Only mode, nothing should be actually saved.
        observe
            .pipe(take(1))
            .pipe(finalize(() => {
                this.saving = false;
            }))
            .subscribe(
                () => {
                    this.confirmed.emit();
                    this.reset();
                    this.closeDialogue();
                }
            );
    }

    /**
     * Build a list of call reason IDs with corresponding "other" text, to pass to NotesService.recordCallReasons().
     */
    private _buildCallReasonNotes(): ILogCallSelection[] {
        // const notes: ICallReasonNote[] = this.selectedReasonIds.map((reasonId: string) => {
        //     return <ICallReasonNote>{
        //         callReasonId: reasonId,
        //         otherReason: this.otherReason[reasonId] || null
        //     };
        // });

        const notes = this.selectedReasons.map((reason) => {
            const otherReason = this.otherReason[reason.callReasonId] ? this.otherReason[reason.callReasonId] : null;
            return {
                call_type: {
                    id: reason.callTypeId,
                    label: reason.callTypeLabel
                },
                call_reason: {
                    id: reason.callReasonId,
                    label: reason.callReasonLabel
                },
                other_reason: this.otherReason[reason.callReasonId]
            };
        });

        return notes;
    }

    /**
     * Cancels the call nature selection.
     */
    answerNo() {
        this.cancel.emit();
        this.closeDialogue();
    }

    /**
     *
     */
    canSave(): boolean {
        return !this.saving && this.isCallTypeSelected() && this.isAtLeastOneReasonSelected();
    }

    /**
     * An iterator for the list of call types.
     */
    trackByCallType(index: number, item: string): number {
        return index;
    }

    /**
     * An iterator for the list of call reasons.
     */
    trackByCallReason(index: number, item: LogCallReason): string {
        return item.id;
    }

    /**
     * Builds a "flat" list of call reasons with their matching call type.
     */
    private _buildInternalCallReasonList() {
        const list: ICallReasonListItem[] = [];
        this.callTypes.forEach((callType: LogCallType) => {
            this.callReasons[callType.id].forEach((callReason: LogCallReason) => {
                list.push({
                    callTypeId: callType.id,
                    callTypeLabel: callType.label,
                    callReasonId: callReason.id,
                    callReasonLabel: callReason.label
                });
            });
        });

        this.callReasonList = list;
    }

}
