import { Component, Input, OnChanges, OnInit, OnDestroy, SimpleChange } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ManageATenancyAPIService } from '../../API/ManageATenancyAPI/manageatenancy-api.service';
import { Transaction } from '../../interfaces/transaction.interface';

@Component({
    selector: 'app-transactions',
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit, OnChanges, OnDestroy {
    @Input() tenancyRef: string;
    @Input() currentBalance: number;
    @Input() filter: { [propKey: string]: string };
    @Input() minDate?: Date;
    @Input() maxDate?: Date;
    @Input() isTall?: boolean;

    private _destroyed$ = new Subject();

    _loading: boolean;
    _rows: Transaction[];
    _filtered: Transaction[];
    _period = 'six-months';
    _period_options = [
        { key: 'six-months', label: 'Last 6 months' },
        { key: 'twelve-months', label: 'Last 12 months' },
        { key: '2017', label: '2017' },
        { key: '2016', label: '2016' }
    ];

    constructor(private ManageATenancyAPI: ManageATenancyAPIService) { }

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
        if (changes.tenancyRef) {
            // The tenancy reference has changed, so load the transactions associated with the tenancy reference.
            this._loadTransactions();
        } else {
            // The filter or date settings have changed, so update what is displayed.
            console.log('filter has changed.');
            this._filterTransactions();
        }
    }

    ngOnDestroy() {
        this._destroyed$.next();
    }

    /**
     *
     */
    _loadTransactions() {
        this._loading = true;
        const subscription = this.ManageATenancyAPI
            .getTransactions(this.tenancyRef)
            .pipe(
                takeUntil(this._destroyed$)
            )
            .subscribe(
                (rows) => {
                    let balance = this.currentBalance;
                    this._rows = rows.map((row) => {
                        row.balance = balance;
                        balance -= row.realValue;
                        return row;
                    });
                    this._filterTransactions();
                },
                (error) => {
                    console.error(error);
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
