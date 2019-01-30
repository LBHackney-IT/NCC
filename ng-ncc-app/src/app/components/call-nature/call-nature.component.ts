import { ChangeDetectorRef, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Observable, forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { HackneyAPIService } from '../../API/HackneyAPI/hackney-api.service';
import { ILogCallSelection } from '../../interfaces/log-call-selection';
import { LogCallReason } from '../../classes/log-call-reason.class';
import { LogCallType } from '../../classes/log-call-type.class';
import { CALL_REASON } from '../../constants/call-reason.constant';

@Component({
    selector: 'app-call-nature',
    templateUrl: './call-nature.component.html',
    styleUrls: ['./call-nature.component.scss']
})
export class CallNatureComponent implements OnInit, OnDestroy {
    @ViewChild('otherReasonField') otherReasonField: ElementRef;
    @Output() changed = new EventEmitter<ILogCallSelection>();

    private _destroyed$ = new Subject();

    optionOther: LogCallReason;
    callTypes: LogCallType[];
    callReasons: Array<any>;
    error: boolean;
    selected: ILogCallSelection; // the selected call type and reason.

    constructor(private HackneyAPI: HackneyAPIService, private cdRef: ChangeDetectorRef) { }

    ngOnInit() {
        this.selected = new ILogCallSelection;
        this.selected.call_type = null;
        this.selected.call_reason = null;

        // Fetch a list of call types and reasons from the Hackney API.
        forkJoin(
            this.HackneyAPI.getCallTypes(),
            this.HackneyAPI.getCallReasons()
        )
            .pipe(
                takeUntil(this._destroyed$)
            )
            .subscribe(
                data => {
                    this.callTypes = data[0];
                    this.callReasons = data[1];
                },
                () => { this.error = true; }
            );
    }

    /**
     *
     */
    ngOnDestroy() {
        this._destroyed$.next();
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
     * Returns TRUE if "other" is selected as the call reason.
     */
    isOtherReasonSelected(): boolean {
        return this.selected.call_reason && this.optionOther.id === this.selected.call_reason.id;
    }

    /**
     * Fires the changed event for this component.
     */
    updateSelection() {
        this.changed.emit(this.selected);

        // see https://stackoverflow.com/a/46051865/4073160
        // The "other reason" text field is normally hidden, so the ViewChild reference will normally be undefined.
        // We can manually detect a change to the reference before setting the focus on the text field, if necessary.
        this.cdRef.detectChanges();
        if (this.isOtherReasonSelected()) {
            this._focusOtherReason();
        }
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
     * Returns a list of call reasons for the currently selected call type, ordered alphabetically (ascending).
     */
    getCallTypeReasons(): LogCallReason[] {
        if (this.isCallTypeSelected()) {
            const reasons: LogCallReason[] = Array.from(this.callReasons[this.selected.call_type.id]);
            // We use Array.from() to create a new instance of the list of call reasons.
            // Without this we would have an ever-shrinking list of call reasons as they are selected,
            // because of the below method.

            this._separateOther(reasons);

            reasons.sort(this._sortCallReasons);

            return reasons;
        }
    }

    reset() {
        if (this.selected) {
            this.selected.call_type = null;
            this.selected.call_reason = null;
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
     * This is called when the call type is set/changed, and resets the selected call reason.
     */
    resetCallReason() {
        this.selected.call_reason = null;
    }

    /**
     * Returns TRUE if a call type has been selected.
     */
    isCallTypeSelected(): boolean {
        return this.selected.call_type instanceof LogCallType;
    }

    /**
     * Returns TRUE if a call reason has been selected.
     */
    isCallReasonSelected(): boolean {
        return this.selected.call_reason instanceof LogCallReason;
    }

}
