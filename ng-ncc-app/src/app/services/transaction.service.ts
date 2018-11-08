import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';

import { PAYMENT_STATUS } from '../constants/payment-status.constant';
import { IParisResponse } from '../interfaces/paris-response';
import { IPaymentInteraction } from '../interfaces/payment-interaction';
import { NCCAPIService } from '../API/NCCAPI/ncc-api.service';
import { UHTriggerService } from '../services/uhtrigger.service';


@Injectable({
    providedIn: 'root'
})
export class TransactionService {
    // This transaction service is used to store the outcome of a Paris transaction.

    data: IParisResponse;

    constructor(private NCCAPI: NCCAPIService, private UHTrigger: UHTriggerService) { }

    /**
     *
     */
    clear() {
        this.data = null;
    }

    /**
     *
     */
    process(transaction_data: string) {
        this.clear();
        this.data = this._processData(transaction_data);
        this.getPaymentInteraction();
        // Note: we don't have to wait for this to complete.

        if (this.wasSuccessful()) {
            // Record an automatic note about the payment having been made.
            this.UHTrigger.madePayment(this.data.amount, this.data.receiptnumber);
        }
    }

    /**
     *
     */
    getPaymentInteraction() {
        // Apparently this call is necessary to record the status of a payment.
        this.NCCAPI.getPaymentInteractions(
            this.data.interactionId,
            this.data.username,
            this.data.receiptnumber,
            this.wasSuccessful() ? PAYMENT_STATUS.SUCCESSFUL : PAYMENT_STATUS.FAILED
        )
            .pipe(take(1))
            .subscribe((data: IPaymentInteraction) => {
                // data.InteractionData contains some information about the caller.
                // data.PaymentRecorded contains the outcome of recording the payment.
                // data.UserData contains the agent that dealt with the transaction.
            });
    }

    /**
     * Interpret the data passed to this page from Paris.
     */
    private _processData(query: string): IParisResponse {
        // https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_frompairs
        const fromPairs = function(arr) {
            return arr.reduce(function(accumulator, value) {
                accumulator[value[0]] = decodeURIComponent(value[1]);
                return accumulator;
            }, {});
        };

        const data = query.split('$').map((row) => {
            const parts = row.split(':');
            return [parts.shift(), parts.join(':')]; // for the benefit of timestamps.
        });
        return fromPairs(data);
    }

    /**
     * Returns TRUE if the payment had been processed successfully.
     */
    wasSuccessful(): boolean {
        return 'true' === this.data.serviceprocessed;
        // 'false' evaluates to true.
    }

}
