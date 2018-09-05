import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AccountDetails } from '../../../interfaces/account-details.interface';
import { Transaction } from '../../../interfaces/transaction.interface';
import { CommsOption } from '../../../classes/comms-option.class';
import { CommsSelection } from '../../../classes/comms-selection.class';
import { NotifyAPIService } from '../../../API/NotifyAPI/notify-api.service';
import { ManageATenancyAPIService } from '../../../API/ManageATenancyAPI/manageatenancy-api.service';
import { CONTACT } from '../../../constants/contact.constant';

@Component({
    selector: 'app-payment-summary',
    templateUrl: './payment-summary.component.html',
    styleUrls: ['./payment-summary.component.scss']
})
export class PagePaymentSummaryComponent implements OnInit {

    CONTACT_METHOD = CONTACT;
    account_details: AccountDetails;
    comms_options: CommsOption[];
    selected_method: CommsSelection;
    selected_template: CommsOption; // what to send.
    transactions: Transaction[];
    payment_history: { [propKey: string]: any }[];

    constructor(private NotifyAPI: NotifyAPIService, private ManageATenancyAPI: ManageATenancyAPIService, private route: ActivatedRoute) { }

    ngOnInit() {
        this.selected_template = null;
        this.selected_method = null;

        this.route.data
            .subscribe((data) => {
                this.comms_options = data.templates;
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
                        this.transactions = rows;
                    },
                    (error) => {
                        console.error(error);
                    },
                    () => {
                        subscription.unsubscribe();
                    }
                );
        } else {
            this.makeDummyHistory();
        }
    }

    makeDummyHistory() {
        this.transactions = [];
        const rows = Math.random() * 30 + 10;
        for (let i = 1; i <= rows; i++) {
            this.transactions.push({
                tagReference: '...',
                propertyReference: '...',
                transactionSid: null,
                houseReference: '...',
                transactionType: '...',
                postDate: new Date().toLocaleDateString('en-GB'),   // timestamp
                realValue: -(Math.random() * 100).toFixed(2),
                transactionID: '...',
                debDesc: 'Housing Benefit'
            } as Transaction);
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

    /**
     *
     */
    isInCredit(): boolean {
        return this.account_details && this.account_details.currentBalance < 0;
    }

    /**
     *
     */
    isInDebit(): boolean {
        return this.account_details && this.account_details.currentBalance > 0;
    }

}
