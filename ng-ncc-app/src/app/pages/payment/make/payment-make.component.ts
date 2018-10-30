import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';

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

    // Listen to the window's storage event.
    // This is fired whenever a localStorage property (it has access to?) is *changed*.
    @HostListener('window:storage', ['$event'])
    onLocalstorageUpdate(e) {
        if ('ncc-payment' === e.key) {
            var response = e.newValue;

            // Remove the item.
            localStorage.removeItem('ncc-payment');

            // Go to the transaction (completed) page, passing the returned information.
            this.router.navigateByUrl(`/transaction/${response}`);

            // Close the window we opened below.
            // NOTE: there might not be a window reference: this might happen if the window was opened as a result of enabling popup windows
            // in the browser (i.e. the window wouldn't be created by the app).
            if (this._w) {
                this._w.close();
            }
        }
    }

    account_details: IAccountDetails;
    show_confirm: boolean;
    form = {
        to_pay: null
    };

    constructor(private Call: CallService, private NCCAPI: NCCAPIService, private router: Router) { }

    ngOnInit() {
        this.account_details = this.Call.getAccount();
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
        return parseFloat(this.form.to_pay) > 0;
    }

    /**
     * A callback for if the user confirms making a payment.
     */
    answeredYes() {
        // console.log(`Confirmed payment of £${this.form.to_pay}.`);

        this.NCCAPI.beginPayment(
            this.Call.getCallID(),
            this.Call.getCaller().getContactID(),
            this.Call.getTenancyReference(),
            this.Call.getCallNature().call_reason.id,
            this.Call.getTicketNumber(),
            this.form.to_pay
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
        return this.account_details.currentBalance - this.form.to_pay;
    }

}
