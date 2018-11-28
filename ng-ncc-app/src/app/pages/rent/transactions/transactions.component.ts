import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { PAGES } from '../../../constants/pages.constant';
import { IAccountDetails } from '../../../interfaces/account-details';
import { ManageATenancyAPIService } from '../../../API/ManageATenancyAPI/manageatenancy-api.service';
import { PageHistory } from '../../abstract/history';
import { CallService } from '../../../services/call.service';
import { PageTitleService } from '../../../services/page-title.service';

@Component({
    selector: 'app-rent-transactions',
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.scss']
})
export class PageRentTransactionsComponent extends PageHistory implements OnInit, OnDestroy {

    private _destroyed$ = new Subject();

    account_details: IAccountDetails;

    filter_settings: {
        min_date: Date,
        max_date: Date,
        manual: { [propKey: string]: string }
    };

    filter_type: string;

    constructor(
        private Call: CallService,
        private ManageATenancyAPI: ManageATenancyAPIService,
        private route: ActivatedRoute,
        private router: Router,
        private PageTitle: PageTitleService) {
        super();
    }

    /**
     *
     */
    ngOnInit() {
        this.PageTitle.set(PAGES.RENT_TRANSACTIONS.label);

        // Set up the filter.
        this.filter = {
            min_date: null,
            max_date: null,
            manual: {}
        };

        this.Call.getAccount()
            .pipe(takeUntil(this._destroyed$))
            .subscribe((account: IAccountDetails) => { this.account_details = account; });

        this.route.data
            .pipe(
                takeUntil(this._destroyed$)
            )
            .subscribe((data) => {
                // this.account_details = data.IAccountDetails;
                this.filterByDate();
                this.filterTransactions();
            });
    }

    ngOnDestroy() {
        this._destroyed$.next();
    }

    /**
     * Set the manual filtering options for the list of transactions.
     */
    filterTransactions() {
        this.filter.manual = {
            debDesc: this.filter_type
        };
    }

    /**
     * Clear the transaction filter.
     */
    clearFilter() {
        this.filter_type = null;
        this.filterTransactions();
    }

    /**
     * Begin creating a statement.
     */
    createStatement() {
        this.router.navigate([PAGES.RENT_STATEMENT.route]);
    }

}
