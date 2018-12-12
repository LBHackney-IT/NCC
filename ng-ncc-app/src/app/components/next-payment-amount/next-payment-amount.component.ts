// This component takes account details and displays a "next payment" amount.
// The amount relates to how much the tenant has to pay to take their balance to zero.

import { Component, Input } from '@angular/core';
import { IAccountDetails } from '../../interfaces/account-details';
import { NextPaymentService } from '../../services/next-payment.service';

@Component({
    selector: 'app-next-payment-amount',
    templateUrl: './next-payment-amount.component.html',
    styleUrls: ['./next-payment-amount.component.scss']
})
export class NextPaymentAmountComponent {

    @Input() account: IAccountDetails;

    constructor(private NextPayment: NextPaymentService) { }

    get value(): number {
        return this.NextPayment.calculate(this.account);
    }
}
