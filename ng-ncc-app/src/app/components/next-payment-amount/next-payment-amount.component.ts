// This component takes account details and displays a "next payment" amount.
// The amount relates to how much the tenant has to pay to take their balance to zero.

import { Component, Input, OnChanges } from '@angular/core';
import { IAccountDetails } from '../../interfaces/account-details';

@Component({
    selector: 'app-next-payment-amount',
    templateUrl: './next-payment-amount.component.html',
    styleUrls: ['./next-payment-amount.component.scss']
})
export class NextPaymentAmountComponent implements OnChanges {

    @Input() account: IAccountDetails;

    balance: number;
    benefit: number;
    rent: number;

    ngOnChanges() {
        if (this.account) {
            this.balance = this.account.currentBalance;
            this.benefit = this.account.benefit;
            this.rent = this.account.rent;
        }
    }

    get value(): number {

        return this.balance + this.rent - this.benefit;
    }
}
