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
            call_type: null,
            call_reason: null
        };
    }

    ngOnInit() {
        // Fetch a list of call types and reasons from the Hackney API.
        this.HackneyAPI.getCallTypes().then((types) => {
            this.call_types = types;
        });
        /*$q.all({
            types:   HackneyAPI.getCallTypes(),
            reasons: HackneyAPI.getCallReasons()
        })
        .then(function(responses) {
            this.call_types   = responses.types;
            this.call_reasons = responses.reasons;
        });*/
    }

    // getReasonsForCallType() {
    //     if ( isCallTypeSelected() ) {
    //         reasons = this.call_reasons[ this.selected.call_type ];
    //         //reasons = $filter('orderBy')(reasons, 'label'); // in alphabetical order.
    //         return reasons;
    //     }
    //     return null;
    // }

    resetCallReason() {
        this.selected.call_reason = null;
    }

    canProceed() {
        return this.isCallTypeSelected() && this.isCallReasonSelected();
    }

    isCallTypeSelected() {
        return (null !== this.selected.call_type);
    }

    isCallReasonSelected() {
        return (null !== this.selected.call_reason);
    }

}
