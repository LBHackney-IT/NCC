import { Component, Input, OnChanges, OnInit, OnDestroy, SimpleChange } from '@angular/core';
import { Subject } from 'rxjs';
import { take, finalize } from 'rxjs/operators';
import * as moment from 'moment';

import { NCCAPIService } from 'src/app/common/API/NCCAPI/ncc-api.service';
import { IAccountDetails } from 'src/app/common/interfaces/account-details';
import { ITenancyTransactionRow } from 'src/app/common/interfaces/tenancy-transaction-row';

@Component({
    selector: 'app-transactions',
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit, OnChanges, OnDestroy {
    @Input() account: IAccountDetails;
    @Input() filter: { [propKey: string]: string };
    @Input() minDate?: Date;
    @Input() maxDate?: Date;
    @Input() isTall?: boolean;

    private _destroyed$ = new Subject();

    error: boolean;
    _loading: boolean;
    _rows: ITenancyTransactionRow[];
    _filtered: ITenancyTransactionRow[];
    _period = 'six-months';
    _period_options = [
        { key: 'six-months', label: 'Last 6 months' },
        { key: 'twelve-months', label: 'Last 12 months' },
        { key: '2017', label: '2017' },
        { key: '2016', label: '2016' }
    ];

    constructor(private NCCAPI: NCCAPIService) { }

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
        if (changes.account || changes.minDate || changes.maxDate) {
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
     * Fetch a list of transactions for the tenancy reference defined in this component.
     */
    _loadTransactions() {
        this.error = false;
        this._loading = true;

        this.NCCAPI
            .getAllTenancyTransactionStatements(
                this.account.tagReferenceNumber,
                moment(this.minDate).format('DD/MM/YYYY'),
                moment(this.maxDate).format('DD/MM/YYYY')
            )
            .pipe(take(1))
            .pipe(finalize(() => {
                this._loading = false;
            }))
            .subscribe(
                (rows: ITenancyTransactionRow[]) => {
                    this._rows = rows;
                    this._filterTransactions();
                },
                () => {
                    this.error = true;
                }
            );
    }

    /**
     *
     */
    _filterTransactions() {
        this._filtered = this._rows.filter(
            (item: ITenancyTransactionRow) => {
                let outcome = true;

                if (this.filter) {
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
