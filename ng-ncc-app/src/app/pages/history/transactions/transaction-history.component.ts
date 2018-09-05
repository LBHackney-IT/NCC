import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AccountDetails } from '../../../interfaces/account-details.interface';
import { Transaction } from '../../../interfaces/transaction.interface';
import { PageHistoryComponent } from '../history.component';
import { NotifyAPIService } from '../../../API/NotifyAPI/notify-api.service';
import { ManageATenancyAPIService } from '../../../API/ManageATenancyAPI/manageatenancy-api.service';

@Component({
    selector: 'app-transaction-history',
    templateUrl: './transaction-history.component.html',
    styleUrls: ['./transaction-history.component.scss']
})
export class PageTransactionHistoryComponent extends PageHistoryComponent implements OnInit {

    account_details: AccountDetails;
    transactions: Transaction[];

    constructor(private ManageATenancyAPI: ManageATenancyAPIService, private route: ActivatedRoute) {
        super();
    }

    ngOnInit() {
        this.route.data
            .subscribe((data) => {
                this.account_details = data.accountDetails;
                this._loadTransactions();
            });
    }

    _loadTransactions() {
        if (this.account_details) {
            const subscription = this.ManageATenancyAPI
                .getTransactions(this.account_details.tagReferenceNumber)
                .subscribe(
                    (rows) => {
                        // this.transactions = rows;
                        let balance = this.account_details.currentBalance;
                        this.history = rows.map((row) => {
                            row.balance = balance;
                            balance -= row.realValue;
                            return row;
                        });
                        this.filterTransactions();
                    },
                    (error) => {
                        console.error(error);
                    },
                    () => {
                        subscription.unsubscribe();
                    }
                );
        } else {
            this.updateDummyHistory();
        }
    }

    /**
     *
     */
    makeDummyHistory(row_count: number = 30) {
        this.history = [];
        const reasons = ['Housing benefits', 'Rent', 'Interest', 'Charges', 'We felt like it'];
        const rows = Math.random() * row_count + 10;
        let amount = (Math.random() * 10000);
        let payment = 0;
        for (let i = 1; i <= rows; i++) {
            payment = Math.random() * 100;
            this.history.push({
                tagReference: '...',
                propertyReference: '...',
                transactionSid: null,
                houseReference: '...',
                transactionType: '...',
                postDate: new Date().toLocaleDateString('en-GB'),   // timestamp
                realValue: -(Math.random() * 100).toFixed(2),
                transactionID: '...',
                debDesc: 'Housing Benefit',
                balance: 0
            } as Transaction);
            amount -= payment;
        }
    }

    /**
     * Filter the transaction history by type (case insensitive).
     */
    filterTransactions() {
        const term: string = this.filter.type;
        if (null === term) {
            this.filtered_history = this.history;
        } else {
            this.filtered_history = this.history.filter(
                item => item.debDesc && -1 !== item.debDesc.toLowerCase().indexOf(term.toLowerCase())
            );
        }
    }

}
