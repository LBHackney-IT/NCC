import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, OnInit, ViewChild } from '@angular/core';
import { Observable, forkJoin, Subject } from 'rxjs';
import { take } from 'rxjs/operators';

import { LogCallReason } from '../../classes/log-call-reason.class';
import { LogCallType } from '../../classes/log-call-type.class';
import { CALL_REASON } from '../../constants/call-reason.constant';
import { ConfirmDialogueComponent } from '../dialogue/confirm/confirm-dialogue.component';

import { HackneyAPIService } from '../../API/HackneyAPI/hackney-api.service';

@Component({
    selector: 'app-call-nature-dialogue',
    templateUrl: './call-nature-dialogue.component.html',
    styleUrls: ['../dialogue/confirm/confirm-dialogue.component.scss']
})
export class CallNatureDialogueComponent extends ConfirmDialogueComponent implements OnInit {
    @Input() show: boolean;
    @Output() showChange = new EventEmitter<boolean>();
    @Output() confirmed = new EventEmitter<void>();
    @Output() cancel = new EventEmitter<void>();

    @ViewChild('otherReasonField') otherReasonField: ElementRef;

    OTHER = new LogCallReason(CALL_REASON.OTHER, 'Other');

    selectedType: LogCallType;
    selectedReasons: LogCallReason[];
    selectedReasonOther: string;

    callTypes: LogCallType[];
    callReasons: { [propKey: number]: LogCallReason[] };
    error: boolean;


    constructor(private HackneyAPI: HackneyAPIService, private cdRef: ChangeDetectorRef) {
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
    }

    /**
     * Returns a list of call reasons for the currently selected call type, ordered alphabetically (ascending).
     */
    getCallTypeReasons(): LogCallReason[] {
        if (this.isCallTypeSelected()) {
            const reasons: LogCallReason[] = this.callReasons[this.selectedType.id];
            reasons.sort(this._sortCallReasons);

            return reasons;
        }
    }

    /**
     *
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
     * This is called when the call type is set/changed, and resets the selected call reason.
     */
    resetCallReason() {
        this.selectedReasons = [];
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

    isReasonSelected(reason: LogCallReason) {
        return this.selectedReasons && this.selectedReasons.indexOf(reason) > -1;
    }

    /**
     * Returns TRUE if "other" is selected as the call reason.
     */
    isOtherReasonSelected(): boolean {
        return this.isReasonSelected(this.OTHER);
    }

    /**
     * Set the focus on the other reason field.
     */
    private _focusOtherReason() {
        if (this.otherReasonField) {
            this.otherReasonField.nativeElement.focus();
        }
    }

    answerYes() {
        // TODO disable the "save and end call" button.
        // TODO save the selected call type.
        // TODO save the selected call reasons.
    }

    /**
     * Cancels the call nature selection.
     */
    answerNo() {
        this.cancel.emit();
        this.closeDialogue();
    }

}
