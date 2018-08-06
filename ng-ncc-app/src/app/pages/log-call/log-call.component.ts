import { Component, OnInit } from '@angular/core';

import { HackneyAPIService } from '../../api/hackney-api.service';


@Component({
  selector: 'app-page-log-call',
  templateUrl: './log-call.component.html',
  styleUrls: ['./log-call.component.css']
})

export class PageLogCallComponent implements OnInit {

    call_types: Array<Object>;
    call_reasons: Array<Object>;
    selected: Object;

    constructor(private HackneyAPI: HackneyAPIService) {
        this.selected = {
            call_type:   null,
            call_reason: null
        };
    }

    ngOnInit() {
        // Fetch a list of call types and reasons from the Hackney API.

        /*
        // Promise method...
        this.HackneyAPI.getCallTypes_P().then((types) => {
            this.call_types = types;
        });
        */

        // Observable method...
        this.HackneyAPI.getCallTypes_O().subscribe(types => {
            this.call_types = types;
        });
        this.HackneyAPI.getCallReasons_O().subscribe(types => {
            this.call_reasons = types;
        });
    }

    /**
     * Returns a list of call reasons for the currently selected call type, ordered alphabetically.
     */
    getCallTypeReasons() {
        if ( this.isCallTypeSelected() ) {
            let reasons = this.call_reasons[ this.selected.call_type ];
            reasons.sort(function(a, b){
                let left  = a.label.toLowerCase();
                let right = b.label.toLowerCase();

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
        console.log('Call reason was reset.');
        this.selected.call_reason = null;
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

}
