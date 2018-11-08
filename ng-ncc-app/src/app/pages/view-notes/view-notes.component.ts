import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PAGES } from '../../constants/pages.constant';
import { PageHistory } from '../abstract/history';
import { IdentifiedCaller } from '../../classes/identified-caller.class';
import { CallService } from '../../services/call.service';
import { PageTitleService } from '../../services/page-title.service';

@Component({
    selector: 'app-view-notes',
    templateUrl: './view-notes.component.html',
    styleUrls: ['./view-notes.component.scss']
})
export class PageViewNotesComponent extends PageHistory implements OnInit, OnDestroy {

    private _destroyed$ = new Subject();

    caller: IdentifiedCaller;
    tenants: { [propKey: string]: string }[];

    filter_settings: {
        min_date: Date,
        max_date: Date,
        manual: { [propKey: string]: string }
    };

    filter_reason: string;
    filter_caller: string;

    constructor(private route: ActivatedRoute, private Call: CallService, private PageTitle: PageTitleService) {
        super();
    }

    /**
     *
     */
    ngOnInit() {
        this.PageTitle.set(PAGES.VIEW_NOTES.label);

        // Set up the filter.
        this.filter = {
            min_date: null,
            max_date: null,
            manual: {}
        };
        this.tenants = this.Call.getTenants();
        this.clearFilter();
    }

    ngOnDestroy() {
        this._destroyed$.next();
    }

    getTenancyReference(): string {
        return this.Call.getTenancyReference();
    }

    /**
     * Set the manual filtering options for the list of transactions.
     */
    filterTransactions() {
        this.filter.manual = {
            callReasonType: this.filter_reason,
            clientName: this.filter_caller
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

    /**
     *
     */
    trackByTenants(index: number, item: { [propKey: string]: string }): string {
        // TODO: item should use an interface.
        return item.contact_id;
    }

}
