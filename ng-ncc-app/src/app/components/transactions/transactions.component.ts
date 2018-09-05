import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ManageATenancyAPIService } from '../../API/ManageATenancyAPI/manageatenancy-api.service';
import { Transaction } from '../../interfaces/transaction.interface';

@Component({
    selector: 'app-transactions',
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {
    @Input() tenancyRef: string;
    @Input() currentBalance: number;
    @Input() showFilter: boolean;

    _loading: boolean;
    _rows: Transaction[];
    _filtered: Transaction[];
    _filter = {
        type: null
    };
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
    ngOnChanges() {
        if (this.tenancyRef) {
            this._loadTransactions();
        }
    }

    /**
     *
     */
    _loadTransactions() {
        this._loading = true;
        const subscription = this.ManageATenancyAPI
            .getTransactions(this.tenancyRef)
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
        const term: string = this._filter.type;
        if (null === term) {
            this._filtered = this._rows;
        } else {
            this._filtered = this._rows.filter(
                item => item.type && -1 !== item.debDesc.toLowerCase().indexOf(term.toLowerCase())
            );
        }
    }


    /**
     *
     */
    shouldShowFilter(): boolean {
        return this.showFilter && (this.transactions && this.transactions.length > 0);
    }

}
