import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AccountDetails } from '../../../interfaces/account-details.interface';

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

    constructor(private route: ActivatedRoute) { }

    ngOnInit() {
        this.selected_template = null;
        this.selected_method = null;

        this.route.data
            .subscribe((data) => {
                this.account_details = data.accountDetails;
            });
    }

    confirmPayment() {
        this.show_confirm = true;
    }

    answeredYes() {
        console.log('Confirmed payment.');
    }

    answeredNo() {
        console.log('Cancelled payment.');
    }

}
