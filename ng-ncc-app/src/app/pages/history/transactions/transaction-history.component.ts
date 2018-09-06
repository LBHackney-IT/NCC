import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AccountDetails } from '../../../interfaces/account-details.interface';
import { ManageATenancyAPIService } from '../../../API/ManageATenancyAPI/manageatenancy-api.service';

@Component({
    selector: 'app-transaction-history',
    templateUrl: './transaction-history.component.html',
    styleUrls: ['./transaction-history.component.scss']
})
export class PageTransactionHistoryComponent implements OnInit {

    account_details: AccountDetails;
    filter_date: string;
    filter_type: string;
    filter_settings: {
        min_date: Date,
        max_date: Date,
        manual: { [propKey: string]: string }
    };

    PERIOD_SIX_MONTHS = 'six-months';
    PERIOD_TWELVE_MONTHS = 'twelve-months';
    period_settings: {
        key: string,
        label: string
    }[];
    period_default = this.PERIOD_SIX_MONTHS;

    constructor(private ManageATenancyAPI: ManageATenancyAPIService, private route: ActivatedRoute) { }

    /**
     *
     */
    ngOnInit() {
        // Set up the filter.
        this.filter_settings = {
            min_date: null,
            max_date: null,
            manual: {}
        };

        // Set up the period options.
        const current_year = new Date().getFullYear();
        const previous_year = current_year - 1;
        const two_years_ago = current_year - 2;
        this.period_settings = [
            { key: this.PERIOD_SIX_MONTHS, label: 'Last 6 months' },
            { key: this.PERIOD_TWELVE_MONTHS, label: 'Last 12 months' },
            { key: current_year.toString(), label: current_year.toString() },
            { key: previous_year.toString(), label: previous_year.toString() },
            { key: two_years_ago.toString(), label: two_years_ago.toString() }
        ];
        this.filter_date = this.period_default;

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
        this.filter_settings.manual = {
            debDesc: this.filter_type
        };
    }

    /**
     * Set the date filtering option for the list of transactions.
     */
    filterByDate() {
        let today = new Date();
        let min_date = new Date();
        let max_date = new Date();
        switch (this.filter_date) {
            case this.PERIOD_SIX_MONTHS:
                min_date.setMonth(min_date.getMonth() - 6);
                break;

            case this.PERIOD_TWELVE_MONTHS:
                min_date.setFullYear(min_date.getFullYear() - 1);
                break;

            default:
                // If the selected option is numeric, assume it is a specific year.
                // Otherwise no date filter will be applied.
                const year = parseInt(this.filter_date);
                if (!Number.isNaN(year)) {
                    min_date = new Date(year, 0, 1);
                    max_date = new Date(year + 1, 0, 0);
                }
        }

        this.filter_settings.min_date = min_date;
        this.filter_settings.max_date = max_date;
    }

}
