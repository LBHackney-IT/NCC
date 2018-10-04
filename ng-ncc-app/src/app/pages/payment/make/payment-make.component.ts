import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AccountDetails } from '../../../interfaces/account-details.interface';
import { UHTriggerService } from '../../../services/uhtrigger.service';

@Component({
    selector: 'app-payment-make',
    templateUrl: './payment-make.component.html',
    styleUrls: ['./payment-make.component.scss']
})
export class PagePaymentMakeComponent implements OnInit {

    account_details: AccountDetails;
    show_confirm: boolean;
    form = {
        to_pay: null
    };
    selected_template: string;
    selected_method: string;

    constructor(private UHTrigger: UHTriggerService, private route: ActivatedRoute) { }

    ngOnInit() {
        this.selected_template = null;
        this.selected_method = null;

        this.route.data
            .subscribe((data) => {
                this.account_details = data.accountDetails;
            });
    }

    /**
     * Displays a dialogue for confirming whether to make a payment.
     */
    confirmPayment() {
        this.show_confirm = true;
    }

    /**
     * A callback for if the user confirms making a payment.
     */
    answeredYes() {
        console.log('Confirmed payment.');
        this.UHTrigger.madePayment('abcdef', 100);
    }

    /**
     * A callback for if the user cancels making a payment.
     */
    answeredNo() {
        console.log('Cancelled payment.');
    }

    /**
     * Returns the remaining balance calculated from an entered amount to pay.
     */
    getCalculatedBalance(): number {
        return this.account_details.currentBalance - this.form.to_pay;
    }

}
