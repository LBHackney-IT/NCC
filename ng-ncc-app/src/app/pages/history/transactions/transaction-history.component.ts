import { Component, OnInit } from '@angular/core';
import { PageHistoryComponent } from '../history.component';

@Component({
    selector: 'app-transaction-history',
    templateUrl: './transaction-history.component.html',
    styleUrls: ['./transaction-history.component.scss']
})
export class PageTransactionHistoryComponent extends PageHistoryComponent implements OnInit {

    // TODO this page will require an identified caller.

    ngOnInit() {
        this.updateDummyHistory();
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
     * Filter the transaction history by type (case insensitive).
     */
    filterTransactions() {
        const term: string = this.filter.type;
        if (null === term) {
            this.filtered_history = this.history;
        } else {
            this.filtered_history = this.history.filter(
                item => item.type && -1 !== item.type.toLowerCase().indexOf(term.toLowerCase())
            );
        }
    }

}
