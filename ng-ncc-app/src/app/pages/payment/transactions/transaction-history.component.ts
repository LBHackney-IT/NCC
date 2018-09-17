import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AccountDetails } from '../../../interfaces/account-details.interface';
import { ManageATenancyAPIService } from '../../../API/ManageATenancyAPI/manageatenancy-api.service';
import { PageHistoryComponent } from '../../history/history.component';

@Component({
    selector: 'app-transaction-history',
    templateUrl: './transaction-history.component.html',
    styleUrls: ['./transaction-history.component.scss']
})
export class PageTransactionHistoryComponent extends PageHistoryComponent implements OnInit {

    account_details: AccountDetails;

    filter_settings: {
        min_date: Date,
        max_date: Date,
        manual: { [propKey: string]: string }
    };

    filter_type: string;

    constructor(private ManageATenancyAPI: ManageATenancyAPIService, private route: ActivatedRoute) {
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

        // Set up the period options.
        const current_year = new Date().getFullYear();
        const previous_year = current_year - 1;
        const two_years_ago = current_year - 2;
        this.period_options = [
            { key: this.PERIOD_SIX_MONTHS, label: 'Last 6 months' },
            { key: this.PERIOD_TWELVE_MONTHS, label: 'Last 12 months' },
            { key: current_year.toString(), label: current_year.toString() },
            { key: previous_year.toString(), label: previous_year.toString() },
            { key: two_years_ago.toString(), label: two_years_ago.toString() }
        ];

        this.route.data
            .subscribe((data) => {
                this.account_details = data.accountDetails;
                this.filterByDate();
                this.filterTransactions();
            });
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
     * Set the date filtering option for the list of transactions.
     */
    filterByDate() {
        let min_date = new Date();
        let max_date = new Date();

        switch (this.period) {
            case this.PERIOD_SIX_MONTHS:
                min_date.setMonth(min_date.getMonth() - 6);
                break;

            case this.PERIOD_TWELVE_MONTHS:
                min_date.setFullYear(min_date.getFullYear() - 1);
                break;

            default:
                // If the selected option is numeric, assume it is a specific year.
                // Otherwise no date filter will be applied.
                const year = parseInt(this.period, 10);
                if (!Number.isNaN(year)) {
                    min_date = new Date(year, 0, 1);
                    max_date = new Date(year + 1, 0, 0);
                }
        }

        this.filter.min_date = min_date;
        this.filter.max_date = max_date;
    }

    /**
     *
     */
    clearFilter() {
        this.filter_type = null;
        this.filterTransactions();
    }

}
