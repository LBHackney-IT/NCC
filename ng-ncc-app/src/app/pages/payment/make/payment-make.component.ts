import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-payment-make',
    templateUrl: './payment-make.component.html',
    styleUrls: ['./payment-make.component.scss']
})
export class PagePaymentMakeComponent implements OnInit {

    show_confirm: boolean;

    constructor() { }

    ngOnInit() {
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
