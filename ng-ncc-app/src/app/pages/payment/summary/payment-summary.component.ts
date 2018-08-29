import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { initAll } from 'govuk-frontend';

import { CommsOption } from '../../../classes/comms-option.class';
import { CommsSelection } from '../../../classes/comms-selection.class';
import { NotifyAPIService } from '../../../API/NotifyAPI/notify-api.service';
import { CONTACT } from '../../../constants/contact.constant';

@Component({
    selector: 'app-payment-summary',
    templateUrl: './payment-summary.component.html',
    styleUrls: ['./payment-summary.component.scss']
})
export class PagePaymentSummaryComponent implements OnInit {

    CONTACT_METHOD = CONTACT;
    comms_options: CommsOption[];
    selected_method: CommsSelection;
    selected_template: CommsOption; // what to send.
    payment_history: { [propKey: string]: any }[];

    constructor(private NotifyAPI: NotifyAPIService, private route: ActivatedRoute) { }

    ngOnInit() {
        // Initialise the GOV.UK Frontend components on this page.
        initAll();

        this.selected_template = null;
        this.selected_method = null;

        this.makeDummyHistory();

        this.route.data
            .subscribe((data) => {
                this.comms_options = data.templates;
            });
    }

    makeDummyHistory() {
        this.payment_history = [];
        const rows = Math.random() * 30 + 10;
        let amount = (Math.random() * 10000);
        let payment = 0;
        for (let i = 1; i <= rows; i++) {
            payment = Math.random() * 100;
            this.payment_history.push({
                period: i.toString(),
                date: new Date().toLocaleDateString('en-GB'),
                type: 'Housing benefits',
                amount: -payment.toFixed(2),
                balance: -amount.toFixed(2)
            });
            amount -= payment;
        }
    }

    /**
     * Returns TRUE if the specified communication method is available.
     */
    isMethodAvailable(type: string): boolean {
        if (this.selected_template) {
            return !!(this.selected_template.hasTemplate(type));
        }

        return false;
    }

    /**
     * Called when valid communication method and respective details are entered.
     */
    onSelectCommsMethod(details: CommsSelection) {
        this.selected_method = details;
    }

    /**
     * Called when an invalid communication method and respective details are entered.
     */
    onInvalidCommsMethod() {
        this.selected_method = null;
    }

}
