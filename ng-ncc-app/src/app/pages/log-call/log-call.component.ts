import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { HackneyAPIService } from '../../API/HackneyAPI/hackney-api.service';
import { LogCallSelection } from '../../interfaces/log-call-selection.interface';
import { LogCallReason } from '../../classes/log-call-reason.class';
import { LogCallType } from '../../classes/log-call-type.class';
import { CallService } from '../../services/call.service';

@Component({
    selector: 'app-page-log-call',
    templateUrl: './log-call.component.html',
    styleUrls: ['./log-call.component.css']
})

export class PageLogCallComponent implements OnInit {

    call_types: LogCallType[];
    call_reasons: Array<any>;
    selected: LogCallSelection;
    previous_calls: Array<any>;

    constructor(private router: Router, private HackneyAPI: HackneyAPIService, private Call: CallService) {
        this.selected = {
            call_type: null,
            call_reason: null
        };
    }

    ngOnInit() {
        // Fetch a list of call types and reasons from the Hackney API.

        // Observable method...
        this.HackneyAPI.getCallTypes().subscribe(types => {
            this.call_types = types;
        });
        this.HackneyAPI.getCallReasons().subscribe(types => {
            this.call_reasons = types;
        });

        this._makePreviousCalls();
    }

    /**
     * Returns a list of call reasons for the currently selected call type, ordered alphabetically (ascending).
     */
    getCallTypeReasons() {
        if (this.isCallTypeSelected()) {
            const reasons: Array<LogCallReason> = this.call_reasons[this.selected.call_type.id];
            reasons.sort(function(a: LogCallReason, b: LogCallReason) {
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
     * This is called when the call type is set/changed, and resets the selected call reason.
     */
    proceed() {
        console.log('Call reason was set.');
        this.Call.setCallNature(this.selected);

        // Go to the Caller Details page.
        this.router.navigateByUrl('caller-details');
    }

    /**
     * Returns TRUE if we should be able to proceed.
     */
    canProceed() {
        return this.isCallTypeSelected() && this.isCallReasonSelected();
    }

    /**
     * Returns TRUE if a call type has been selected.
     */
    isCallTypeSelected() {
        return (null !== this.selected.call_type);
    }

    /**
     * Returns TRUE if a call reason has been selected.
     */
    isCallReasonSelected() {
        return (null !== this.selected.call_reason);
    }

    _makePreviousCalls() {
        this.previous_calls = new Array<any>();
        for (let i = 1; i <= 10; i++) {
            this.previous_calls.push({
                reference: `07891/${i}`,
                name: 'Mr ' + (String.fromCharCode(65 + i - 1)) + ' Bell',
                date: new Date().toLocaleDateString('en-GB'),
                time: new Date().toLocaleTimeString('en-GB'),
                call_reason: ['Pay rent', 'General', 'ASB', 'Repairs', 'Other'][(Math.random() * 4).toFixed(0)]
            });
        }
    }

    getLastCalls() {
        return this.previous_calls;
    }


}
