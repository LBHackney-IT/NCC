import { Component, Input, OnInit } from '@angular/core';

import { IAccountDetails } from '../../../common/interfaces/account-details';
import { NextPaymentService } from '../../../common/services/next-payment.service';

@Component({
    selector: 'app-account-balance',
    templateUrl: './account-balance.component.html',
    styleUrls: ['./account-balance.component.scss']
})
export class AccountBalanceComponent implements OnInit {
    @Input() account: IAccountDetails;

    private next_payment: number;

    constructor(private NextPayment: NextPaymentService) { }

    ngOnInit() {
        this.next_payment = this.NextPayment.calculate(this.account);
    }

    /**
     *
     */
    isInCredit(): boolean {
        return this.next_payment > 0;
    }

    /**
     *
     */
    isInDebit(): boolean {
        return this.next_payment < 0;
    }

}
