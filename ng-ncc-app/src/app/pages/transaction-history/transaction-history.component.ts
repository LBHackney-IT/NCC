import { Component, OnInit } from '@angular/core';
import { TransactionTypePipe } from '../../pipes/transaction-type.pipe';

@Component({
    selector: 'app-transaction-history',
    templateUrl: './transaction-history.component.html',
    styleUrls: ['./transaction-history.component.scss']
})
export class PageTransactionHistoryComponent implements OnInit {

    // TODO this page will require an identified caller.

    payment_history: { [propKey: string]: any }[];
    filtered_payment_history: { [propKey: string]: any }[];
    period = 'six-months';
    transaction_filter: { type: null };

    ngOnInit() {
        this.makeDummyHistory();
        this.transaction_filter = { type: null };
        this.filterTransactions();
    }

    /**
     *
     */
    makeDummyHistory(rows: int = 30) {
        this.payment_history = [];
        const reasons = ['Housing benefits', 'Rent', 'Interest', 'Charges', 'We felt like it'];
        const rows = Math.random() * rows + 10;
        let amount = (Math.random() * 10000);
        let payment = 0;
        for (let i = 1; i <= rows; i++) {
            payment = Math.random() * 100;
            this.payment_history.push({
                period: i.toString(),
                date: new Date().toLocaleDateString('en-GB'),
                type: reasons[Math.floor(Math.random() * reasons.length)],
                amount: -payment.toFixed(2),
                balance: -amount.toFixed(2)
            });
            amount -= payment;
        }
    }


    /**
     *
     */
    updateDummyHistory() {
        switch (this.period) {
            case 'six-months':
                this.makeDummyHistory(30);
                break;
            case 'twelve-months':
                this.makeDummyHistory(60);
                break;
            case '2017':
            case '2016':
                this.makeDummyHistory(80);
                break;
        }
    }

    /**
     * Filter the transaction history by type (case insensitive).
     */
    filterTransactions() {
        const term = this.transaction_filter.type;
        console.log('filter by term', term);
        if (term) {
            this.filtered_payment_history = this.payment_history.filter(item => -1 !== item.type.toLowerCase().indexOf(term.toLowerCase()));
        } else {
            this.filtered_payment_history = this.payment_history;
        }
    }

}
