import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, of, forkJoin, Subject } from 'rxjs';
import { finalize, take, takeUntil } from 'rxjs/operators';

import { LogCallReason } from '../../../common/classes/log-call-reason.class';
import { LogCallType } from '../../../common/classes/log-call-type.class';
import { CALL_REASON } from '../../../common/constants/call-reason.constant';
import { ConfirmDialogueComponent } from '../dialogue/confirm/confirm-dialogue.component';

import { ILogCallSelection } from '../../../common/interfaces/log-call-selection';

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
    selectedReasons: string[];  // a list of call reason IDs.
    selectedReasonOther: string;

    callTypes: LogCallType[];
    callReasons: { [propKey: number]: LogCallReason[] };
    error: boolean;


    constructor(
        private HackneyAPI: HackneyAPIService,
        private Notes: NotesService,
        private cdRef: ChangeDetectorRef,
        private ViewOnly: ViewOnlyService
    ) {
        super();
    }

    ngOnInit() {
        this.selectedType = null;
        this.selectedReasons = [];
        this.selectedReasonOther = null;

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
     * Preselects call reasons in the dialogue.
     */
    private _preselectCallReasons() {
        const natures = this.Notes.getUsedCallNatures().map(
            (nature: ILogCallSelection) => nature.call_reason.id
        );
        const other_reasons = this.Notes.getUsedCallNatures().map(
            (nature: ILogCallSelection) => nature.other_reason
        ).filter((reason: string) => null !== reason);
        const unique_natures = new Set(natures).values();

        this.selectedReasons = natures;
        this.selectedReasonOther = other_reasons.join(', ');
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
        return this.selectedReasons && this.selectedReasons.indexOf(reason.id) > -1;
    }

    /**
     * Returns TRUE if a call type has been selected.
     */
    isAtLeastOneReasonSelected() {
        return this.selectedReasons && this.selectedReasons.length > 0;
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
            observe = this.Notes.recordCallReasons(this.selectedReasons, this.selectedReasonOther);
        }

        // Attempt to save the selected call reasons as notes.
        observe
            .pipe(take(1))
            .pipe(finalize(() => {
                this.saving = false;
            }))
            .subscribe(
                () => {
                    this.confirmed.emit();
                    this.closeDialogue();
                    this.selectedType = null;
                }
            );
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

}
