import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { CONTACT } from '../constants/contact.constant';
import { COMMS } from '../constants/comms.constant';
import { CallService } from './call.service';
import { ICaller } from '../../common/interfaces/caller';

@Injectable({
    providedIn: 'root'
})
export class UHTriggerService {
    // This service is used to record UH notes against the current call (tenancy reference) when something in the app happens.
    // Unfortunately there's no real way of telling exactly what was sent, because everything has an ID that might change in the future.
    // Therefore we have to make use of hardcoded call types/reasons/template names for now.

    constructor(private Call: CallService) { }

    _getCaller(): ICaller {
        return this.Call.getCaller();
    }

    /**
     * Called when a comms template has been sent to the caller.
     */
    sentComms(template: string, method: string) {
        // const call_type = this.Call.getCallNature().call_type.label;
        // const call_reason = this.Call.getCallNature().call_reason.label;
        let notify_method: string;

        switch (method) {
            case CONTACT.METHOD_EMAIL:
                notify_method = COMMS.NOTIFY_METHOD_EMAIL;
                break;
            case CONTACT.METHOD_SMS:
                notify_method = COMMS.NOTIFY_METHOD_SMS;
                break;
            case CONTACT.METHOD_POST:
                notify_method = COMMS.NOTIFY_METHOD_POST;
                break;
        }

        this.Call.recordCommsNote(template, notify_method)
            .pipe(take(1))
            .subscribe();
    }

    /**
     * Called when a payment has been made against a caller's account.
     */
    madePayment(amount: number, payment_reference: string) {
        // Only continue if there is an identified caller.
        if (this.Call.isCallerIdentified() || this.Call.isCallerNonTenant()) {
            this.Call.recordAutomaticNote(`Rent payment taken: £${amount} (ref: ${payment_reference})`)
                .pipe(take(1))
                .subscribe();
        }
    }

    /**
     * Called when a statement was sent.
     */
    sentStatement(method: string) {
        if (this.Call.isCallerIdentified()) {
            this.Call.recordAutomaticNote(`Transaction history sent by ${method}.`)
                .pipe(take(1))
                .subscribe();
        }
    }


}
