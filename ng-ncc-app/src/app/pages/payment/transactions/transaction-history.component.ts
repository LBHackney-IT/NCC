import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { IAccountDetails } from '../../../interfaces/account-details';
import { ManageATenancyAPIService } from '../../../API/ManageATenancyAPI/manageatenancy-api.service';
import { PageHistory } from '../../abstract/history';
import { CallService } from '../../../services/call.service';

@Component({
    selector: 'app-transaction-history',
    templateUrl: './transaction-history.component.html',
    styleUrls: ['./transaction-history.component.scss']
})
export class PageTransactionHistoryComponent extends PageHistory implements OnInit, OnDestroy {

    private _destroyed$ = new Subject();

    account_details: IAccountDetails;

    filter_settings: {
        min_date: Date,
        max_date: Date,
        manual: { [propKey: string]: string }
    };

    filter_type: string;

    constructor(private Call: CallService, private ManageATenancyAPI: ManageATenancyAPIService, private route: ActivatedRoute) {
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

        this.account_details = this.Call.getAccount();

        this.route.data
            .pipe(
                takeUntil(this._destroyed$)
            )
            .subscribe((data) => {
                // this.account_details = data.accountDetails;
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
     *
     */
    clearFilter() {
        this.filter_type = null;
        this.filterTransactions();
    }

}
