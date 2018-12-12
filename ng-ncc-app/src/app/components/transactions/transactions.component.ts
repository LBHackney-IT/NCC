import { Component, Input, OnChanges, OnInit, OnDestroy, SimpleChange } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ManageATenancyAPIService } from '../../API/ManageATenancyAPI/manageatenancy-api.service';
import { IAccountDetails } from '../../interfaces/account-details';
import { ITransaction } from '../../interfaces/transaction';
import { NextPaymentService } from '../../services/next-payment.service';

@Component({
    selector: 'app-transactions',
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit, OnChanges, OnDestroy {
    @Input() account: IAccountDetails;
    @Input() currentBalance: number;
    @Input() filter: { [propKey: string]: string };
    @Input() minDate?: Date;
    @Input() maxDate?: Date;
    @Input() isTall?: boolean;

    private _destroyed$ = new Subject();

    error: boolean;
    _loading: boolean;
    _rows: ITransaction[];
    _filtered: ITransaction[];
    _period = 'six-months';
    _period_options = [
        { key: 'six-months', label: 'Last 6 months' },
        { key: 'twelve-months', label: 'Last 12 months' },
        { key: '2017', label: '2017' },
        { key: '2016', label: '2016' }
    ];

    constructor(
        private ManageATenancyAPI: ManageATenancyAPIService,
        private NextPayment: NextPaymentService
    ) { }

    /**
     *
     */
    ngOnInit() {
        this._loading = false;
    }

    /**
     *
     */
    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        if (changes.account) {
            // The tenancy reference has changed, so load the transactions associated with the tenancy reference.
            this._loadTransactions();
        } else {
            // The filter or date settings have changed, so update what is displayed.
            this._filterTransactions();
        }
    }

    /**
     *
     */
    ngOnDestroy() {
        this._destroyed$.next();
    }

    /**
     *
     */
    trackByMethod(index: number, item: ITransaction): string {
        return item.transactionID;
    }

    /**
     * Fetch a list of transactions for the tenancy reference defined in this component.
     */
    _loadTransactions() {
        this.error = false;
        this._loading = true;
        const subscription = this.ManageATenancyAPI
            .getTransactions(this.account.tagReferenceNumber)
            .pipe(takeUntil(this._destroyed$))
            .subscribe(
                (rows) => {
                    // let balance = this.currentBalance;
                    let balance = this.NextPayment.calculate(this.account);

                    // We don't get the balance from the API for each transaction row, so we have to calculate it ourselves.
                    // NOTE: the values returned from the API are the reverse of what should be displayed.

                    this._rows = rows.map((row) => {
                        // Set this row's balance to the current balance.
                        row.balance = balance;

                        // Add the transaction amount to the balance, to determine what is displayed on the next row.
                        balance += row.realValue;

                        // Reverse the transaction amount that's displayed in the list.
                        row.realValue = -row.realValue;

                        // This was VERY confusing, but it probably helps to think of the transactions as belonging to the COUNCIL.
                        // Negative transaction values (before reversing for display) would then represent money coming out of the account.

                        return row;
                    });
                    this._filterTransactions();
                },
                (error) => {
                    this.error = true;
                },
                () => {
                    subscription.unsubscribe();
                    this._loading = false;
                }
            );
    }

    _filterTransactions() {
        const min_date = this.minDate ? this.minDate.toISOString() : null;
        const max_date = this.maxDate ? this.maxDate.toISOString() : null;

        this._filtered = this._rows.filter(
            item => {
                let outcome = true;

                // Check against the provided dates (if set).
                if (outcome && min_date) {
                    outcome = item.postDate >= min_date;
                }
                if (outcome && max_date) {
                    outcome = item.postDate < max_date;
                }

                if (outcome && this.filter) {
                    // Put the item through the filter.
                    Object.keys(this.filter).forEach(
                        key => {
                            const term = this.filter[key];
                            if (term) {
                                outcome = outcome && (-1 !== item[key].toLowerCase().indexOf(term.toLowerCase()));
                            }
                        });
                }
                return outcome;
            });
    }

}
