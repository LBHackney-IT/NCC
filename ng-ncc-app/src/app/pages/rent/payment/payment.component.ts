import { Component, HostListener, Injector, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PAGES } from '../../../constants/pages.constant';
import { IAccountDetails } from '../../../interfaces/account-details';
import { CallService } from '../../../services/call.service';
import { NCCAPIService } from '../../../API/NCCAPI/ncc-api.service';
import { PageTitleService } from '../../../services/page-title.service';

@Component({
    selector: 'app-rent-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.scss']
})
export class PageRentPaymentComponent implements OnInit, OnDestroy {

    private _w: Window;

    private _destroyed$ = new Subject();
    PageTitle: PageTitleService;
    Call: CallService;
    NCCAPI: NCCAPIService;
    router: Router;

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

    /**
     *
     */
    constructor(private injectorObj: Injector) {
        this.Call = this.injectorObj.get(CallService);
        this.NCCAPI = this.injectorObj.get(NCCAPIService);
        this.router = this.injectorObj.get(Router);
        this.PageTitle = this.injectorObj.get(PageTitleService);
    }

    /**
     *
     */
    ngOnInit() {
        this.PageTitle.set(PAGES.RENT_PAYMENT.label);
        this.Call.getAccount()
            .pipe(takeUntil(this._destroyed$))
            .subscribe((account: IAccountDetails) => {
                this.account_details = account;
            });
        this.amount = null;
    }

    /**
     *
     */
    ngOnDestroy() {
        this._destroyed$.next();
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
        this.NCCAPI.getPaymentURL(this.Call.getInteractionID(), this.Call.getPaymentReference(), this.getNumericAmount())
            .pipe(take(1))
            .subscribe((url: string) => {
                // For some reason the URL is returned as an encoded string (which makes a BIG difference).
                url = decodeURIComponent(url);
                this._w = window.open(url, 'NCCPayment');
            });
    }

    /**
     * A callback for if the user cancels making a payment.
     */
    answeredNo() {
        // console.log('Cancelled payment.');
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
