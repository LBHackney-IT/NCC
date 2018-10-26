import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { IAccountDetails } from '../../../interfaces/account-details';
import { UHTriggerService } from '../../../services/uhtrigger.service';
import { CallService } from '../../../services/call.service';
import { NCCAPIService } from '../../../API/NCCAPI/ncc-api.service';

@Component({
    selector: 'app-payment-make',
    templateUrl: './payment-make.component.html',
    styleUrls: ['./payment-make.component.scss']
})
export class PagePaymentMakeComponent implements OnInit, OnDestroy {

    private _destroyed$ = new Subject();

    account_details: IAccountDetails;
    show_confirm: boolean;
    form = {
        to_pay: null
    };
    selected_template: string;
    selected_method: string;

    constructor(private Call: CallService, private NCCAPI: NCCAPIService, private UHTrigger: UHTriggerService,
        private route: ActivatedRoute) { }

    ngOnInit() {
        this.selected_template = null;
        this.selected_method = null;
        this.account_details = this.Call.getAccount();

        this.route.data
            .pipe(
                takeUntil(this._destroyed$)
            )
            .subscribe((data) => {
                // this.account_details = data.IAccountDetails;
            });
    }

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
     * A callback for if the user confirms making a payment.
     */
    answeredYes() {
        console.log(`Confirmed payment of £${this.form.to_pay}.`);

        this.NCCAPI.beginPayment(
            this.Call.getCallID(),
            this.Call.getCaller().getContactID(),
            this.Call.getTenancyReference(),
            this.Call.getCallNature().call_reason.id,
            this.Call.getTicketNumber(),
            this.form.to_pay
        );
        // this.UHTrigger.madePayment(this.Call.getTenancyReference(), this.form.to_pay);
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
