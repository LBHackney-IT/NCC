import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PageHistory } from '../abstract/history';
import { IdentifiedCaller } from '../../classes/identified-caller.class';
import { CallService } from '../../services/call.service';

@Component({
    selector: 'app-view-notes',
    templateUrl: './view-notes.component.html',
    styleUrls: ['./view-notes.component.scss']
})
export class PageViewNotesComponent extends PageHistory implements OnInit {

    caller: IdentifiedCaller;
    tenants: { [propKey: string]: string }[];

    filter_settings: {
        min_date: Date,
        max_date: Date,
        manual: { [propKey: string]: string }
    };

    filter_reason: string;
    filter_caller: string;

    constructor(private route: ActivatedRoute, private Call: CallService) {
        super();
    }

    /**
     *
     */
    ngOnInit() {
        // Set up the filter.
        this.filter = {
            min_date: null,
            max_date: null,
            manual: {}
        };
        this.clearFilter();

        this.route.data
            .subscribe((data) => {
                this.caller = data.caller;
                this.tenants = this.Call.getTenants();
            });
    }

    /**
     * Set the manual filtering options for the list of transactions.
     */
    filterTransactions() {
        this.filter.manual = {
            callReasonType: this.filter_reason,
            contactId: this.filter_caller
        };
    }

    /**
     *
     */
    clearFilter() {
        this.filter_reason = null;
        this.filter_caller = null;
        this.filterTransactions();
    }

}
