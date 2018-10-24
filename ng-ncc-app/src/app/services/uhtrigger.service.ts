import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CONTACT } from '../constants/contact.constant';
import { COMMS } from '../constants/comms.constant';
import { CallService } from './call.service';
import { ICaller } from '../interfaces/caller';

@Injectable({
    providedIn: 'root'
})
export class UHTriggerService {
    // This service is used to record Action Diary entries against the current call (tenancy reference) when something in the app happens.
    // Unfortunately there's no real way of telling exactly what was sent, because everything has an ID that might change in the future.
    // Therefore we have to make use of hardcoded call types/reasons/template names for now.

    constructor(private Call: CallService) { }

    _getCaller(): ICaller {
        return this.Call.getCaller();
    }

    /**
     * Called when a comms template has been sent to the caller.
     */
    sentComms(template: string, method: string, data: { [propKey: string]: string }) {
        console.log(template, method, data);

        // Only continue if there is an identified caller.
        // if (!this.Call.isCallerIdentified()) {
        //     return;
        // }

        const call_type = this.Call.getCallNature().call_type.label;
        const call_reason = this.Call.getCallNature().call_reason.label;
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

        switch (call_type) {
            case 'Rent':
                this._sentRentComms(template, notify_method, data);
                break;
        }
    }

    /**
     * Called when a comms template has been sent to the caller.
     */
    madePayment(payment_reference: string, amount: number) {
        console.log(payment_reference, amount);

        // Only continue if there is an identified caller.
        if (!this.Call.isCallerIdentified()) {
            return;
        }

        // TODO we would get the information from a successful payment.
        this.Call.recordAutomaticNote(`Rent payment taken: £${amount} ref: ${payment_reference}`);
    }

    /**
     * Handle a comms template sent as a result of the Rent call type.
     */
    _sentRentComms(template: string, method: string, data: { [propKey: string]: string }) {
        this.Call.recordCommsNote(template, method);
    }

}
