// ========================================================================================================================================
// CALL NATURE DIALOGUE component.
// ========================================================================================================================================

import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { of, forkJoin, Subject } from 'rxjs';
import { finalize, take, takeUntil } from 'rxjs/operators';

import { LogCallReason } from '../../../common/classes/log-call-reason.class';
import { LogCallType } from '../../../common/classes/log-call-type.class';
import { CALL_REASON } from '../../../common/constants/call-reason.constant';
import { ConfirmDialogueComponent } from '../dialogue/confirm/confirm-dialogue.component';

import { ILogCallSelection } from '../../../common/interfaces/log-call-selection';
import { ICallReasonListItem } from '../../../common/interfaces/call-reason-list-item';

import { HackneyAPIService } from '../../../common/API/HackneyAPI/hackney-api.service';
import { NotesService } from '../../../common/services/notes.service';
import { ViewOnlyService } from '../../../common/services/view-only.service';

@Component({
    selector: 'app-call-nature-dialogue',
    templateUrl: './call-nature-dialogue.component.html',
    styleUrls: ['./call-nature-dialogue.component.scss']
})
export class CallNatureDialogueComponent extends ConfirmDialogueComponent
    implements OnInit, OnDestroy {

    // The visible status of the dialogue, which has two-way binding.
    @Input() show: boolean;
    @Output() showChange = new EventEmitter<boolean>();

    // A callback for when the selection of call types and reasons is confirmed.
    @Output() confirmed = new EventEmitter<void>();

    // A callback for when the dialogue is cancelled.
    @Output() cancel = new EventEmitter<void>();

    // A reference to the text field used for entering "other" call reason text.
    @ViewChild('otherReasonField') otherReasonField: ElementRef;

    // A private Subject used to unsubscribe from subscriptions, to avoid memory leaks.
    private _destroyed$ = new Subject<void>();

    callReasonList: ICallReasonListItem[];
    callReasons: { [propKey: number]: LogCallReason[] };
    callTypes: LogCallType[];
    error: boolean;
    optionOther: LogCallReason;
    otherReasonText: { [propKey: string]: string }; // contains additional text for call-type specific "other" reasons.
    otherReasonIds: string[];
    saving: boolean;
    selectedReasonIds: string[];  // a list of call reason IDs.
    selectedReasons: ICallReasonListItem[]; // used to display a list of selected call reasons with their type.
    selectedType: LogCallType;

    ////////////////////

    constructor(
        private cdRef: ChangeDetectorRef,
        private HackneyAPI: HackneyAPIService,
        private Notes: NotesService,
        private ViewOnly: ViewOnlyService
    ) {
        super();
    }

    /**
     *
     */
    ngOnInit() {
        this.reset();

        // Fetch a list of call types and reasons from the Hackney API.
        this.getCallNatures();

        // Subscribe to note addition events.
        this.Notes.noteWasAdded()
            .pipe(takeUntil(this._destroyed$))
            .subscribe(() => {
                // Preselect call reasons.
                this._preselectCallReasons();
            });
    }

    /**
     *
     */
    ngOnDestroy() {
        this._destroyed$.next();
    }

    /**
     *
     */
    getCallNatures() {
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
    }

    /**
     * Reset the selection of call types/reasons.
     */
    reset() {
        this.selectedType = null;
        this.selectedReasonIds = [];
        this.otherReasonText = {};
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
            this.otherReasonText[nature.call_reason.id] = nature.other_reason;
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
        // A dummy "Other" always goes to the bottom of the list.
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
     * Returns TRUE if at least one call type has been selected.
     */
    isAtLeastOneReasonSelected() {
        return (this.selectedReasonIds && this.selectedReasonIds.length);
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
     * Called when the user is attempting to save the call types and reasons.
     */
    answerYes() {
        if (this.saving) {
            return;
        }

        this.error = false;
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
            .pipe(finalize(() => this.saving = false))
            .subscribe(
                () => {
                    this.confirmed.emit();
                    this.reset();
                    this.closeDialogue();
                },
                () => this.error = true
            );
    }

    /**
     * Build a list of call reason IDs with corresponding "other" text, to pass to NotesService.recordCallReasons().
     */
    private _buildCallReasonNotes(): ILogCallSelection[] {
        // const notes: ICallReasonNote[] = this.selectedReasonIds.map((reasonId: string) => {
        //     return <ICallReasonNote>{
        //         callReasonId: reasonId,
        //         otherReason: this.otherReasonText[reasonId] || null
        //     };
        // });

        const notes = this.selectedReasons.map((reason) => {
            const otherReasonText = this.otherReasonText[reason.callReasonId] ? this.otherReasonText[reason.callReasonId] : null;
            return {
                call_type: {
                    id: reason.callTypeId,
                    label: reason.callTypeLabel
                },
                call_reason: {
                    id: reason.callReasonId,
                    label: reason.callReasonLabel
                },
                other_reason: otherReasonText
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
     * Returns TRUE if the list of call types and reasons can be saved.
     */
    canSave(): boolean {
        return !this.saving && this.isAtLeastOneReasonSelected() && !this.isMissingReasonForOther();
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
     * This isn't the most efficient thing to do, particularly if we have hundreds of call types and/or reasons,
     * but it's a simple approach.
     */
    private _buildInternalCallReasonList() {
        const list: ICallReasonListItem[] = [];
        this.otherReasonIds = [];

        this.callTypes.forEach((callType: LogCallType) => {
            this.callReasons[callType.id].forEach((callReason: LogCallReason) => {
                list.push({
                    callTypeId: callType.id,
                    callTypeLabel: callType.label,
                    callReasonId: callReason.id,
                    callReasonLabel: callReason.label
                });
                if ('Other' === callReason.label) {
                    this.otherReasonIds.push(callReason.id);
                }
            });
        });

        this.callReasonList = list;
    }

    /**
     * Retuns TRUE if at one of the "other" options has been selected and there is no corresponding text.
     */
    private isMissingReasonForOther(): boolean {
        if (!this.otherReasonIds) {
            return false;
        }

        const selectedOtherReasonIds = this.otherReasonIds.filter((id) => this.selectedReasonIds.indexOf(id) !== -1);
        const hasBlankReasonText = selectedOtherReasonIds.filter((id) => this.isMissingReasonText(id));

        return hasBlankReasonText.length > 0;
    }

    /**
     *
     */
    private isMissingReasonText(callReasonId: string) {
        if (-1 === this.otherReasonIds.indexOf(callReasonId)) {
            // This call reason isn't "Other".
            return false;
        }

        if (this.otherReasonText.hasOwnProperty(callReasonId)) {
            return this.otherReasonText[callReasonId].trim().length === 0;
        }
        return true;
    }

}
