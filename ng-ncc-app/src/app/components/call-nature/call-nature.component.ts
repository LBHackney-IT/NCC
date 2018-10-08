import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';

import { HackneyAPIService } from '../../API/HackneyAPI/hackney-api.service';
import { LogCallSelection } from '../../interfaces/log-call-selection.interface';
import { LogCallReason } from '../../classes/log-call-reason.class';
import { LogCallType } from '../../classes/log-call-type.class';

@Component({
    selector: 'app-call-nature',
    templateUrl: './call-nature.component.html',
    styleUrls: ['./call-nature.component.scss']
})
export class CallNatureComponent implements OnInit {
    @Output() changed = new EventEmitter<LogCallSelection>();

    call_types: LogCallType[];
    call_reasons: Array<any>;
    selected: LogCallSelection; // the selected call type and reason.

    constructor(private HackneyAPI: HackneyAPIService) { }

    ngOnInit() {
        this.selected = new LogCallSelection;
        this.selected.call_type = null;
        this.selected.call_reason = null;

        // Fetch a list of call types and reasons from the Hackney API.
        forkJoin(
            this.HackneyAPI.getCallTypes(),
            this.HackneyAPI.getCallReasons()
        )
            .subscribe(
                data => {
                    this.call_types = data[0];
                    this.call_reasons = data[1];

                    // Add "other" as an option for each call type.
                    const other_option = new LogCallReason('0', 'Other');
                    Object.keys(this.call_reasons).forEach(key => {
                        this.call_reasons[key].push(other_option);
                    });
                },
                (error) => {
                    console.log('Error fetching call types and reasons:', error);
                }
            );
    }

    /**
     *
     */
    updateSelection() {
        this.changed.emit(this.selected);
    }

    /**
     * Returns a list of call reasons for the currently selected call type, ordered alphabetically (ascending).
     */
    getCallTypeReasons(): LogCallReason[] {
        if (this.isCallTypeSelected()) {
            const reasons: LogCallReason[] = this.call_reasons[this.selected.call_type.id];
            reasons.sort(function(a: LogCallReason, b: LogCallReason) {
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
            });

            return reasons;
        }
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