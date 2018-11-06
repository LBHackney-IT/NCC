import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';

import { PAGES } from '../../../constants/pages.constant';
import { IAccountDetails } from '../../../interfaces/account-details';
import { CallService } from '../../../services/call.service';
import { NCCAPIService } from '../../../API/NCCAPI/ncc-api.service';

@Component({
    selector: 'app-payment-make',
    templateUrl: './payment-make.component.html',
    styleUrls: ['./payment-make.component.scss']
})
export class PagePaymentMakeComponent implements OnInit {

    private _w: Window;

    account_details: IAccountDetails;
    show_confirm: boolean;
    amount: string;

    // Listen to the window's storage event.
    // This is fired whenever a localStorage property (it has access to?) is *changed*.
    @HostListener('window:storage', ['$event'])
    onLocalstorageUpdate(e) {
        if ('ncc-payment' === e.key) {
            const response = e.newValue;

            // Remove the item.
            localStorage.removeItem('ncc-payment');

            // Go to the transaction (completed) page, passing the returned information.
            this.router.navigateByUrl(`${PAGES.TRANSACTION.route}/${response}`);

            // Close the window we opened below.
            // NOTE: there might not be a window reference: this might happen if the window was opened as a result of enabling popup windows
            // in the browser (i.e. the window wouldn't be created by the app).
            if (this._w) {
                this._w.close();
            }
        }
    }

    constructor(private Call: CallService, private NCCAPI: NCCAPIService, private router: Router) { }

    ngOnInit() {
        this.account_details = this.Call.getAccount();
        this.amount = null;
    }

    /**
     * Displays a dialogue for confirming whether to make a payment.
     */
    confirmPayment() {
        this.show_confirm = true;
    }

    /**
     *
     */
    canConfirmPayment(): boolean {
        return this.getNumericAmount() > 0;
    }

    /**
     * A callback for if the user confirms making a payment.
     */
    answeredYes() {
        // console.log(`Confirmed payment of £${this.amount}.`);

        this.NCCAPI.beginPayment(
            this.Call.getCallID(),
            this.Call.getCaller().getContactID(),
            this.Call.getTenancyReference(),
            this.Call.getPaymentReference(),
            this.Call.getCallNature().call_reason.id,
            this.Call.getTicketNumber(),
            this.getNumericAmount()
        )
            .pipe(take(1))
            .subscribe((url: string) => {
                // For some reason the URL is returned as an encoded string (which makes a BIG difference).
                // console.log('Paris payment', url, decodeURIComponent(url));
                url = decodeURIComponent(url);
                this._w = window.open(url, 'NCCPayment');
            });
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
        return this.account_details.currentBalance - this.getNumericAmount();
    }

    /**
     * Returns the entered amount to pay as a number (because it is stored as a string).
     */
    getNumericAmount(): number {
        return parseFloat(this.amount);
    }

    /**
     *
     */
    isCallerIdentified(): boolean {
        return this.Call.isCallerIdentified();
    }

}
