import { Injectable } from '@angular/core';

import { CONTACT } from '../constants/contact.constant';
import { CallService } from './call.service';
import { Caller } from '../interfaces/caller.interface';

@Injectable({
    providedIn: 'root'
})
export class UHTriggerService {
    // This service is used to record Action Diary entries against the current call (tenancy reference) when something in the app happens.
    // Unfortunately there's no real way of telling exactly what was sent, because everything has an ID that might change in the future.
    // Therefore we have to make use of hardcoded call types/reasons/template names for now.

    constructor(private Call: CallService) { }

    _getCaller(): Caller {
        return this.Call.getCaller();
    }

    /**
     * Called when a comms template has been sent to the caller.
     */
    sentComms(template: string, method: string, data: { [propKey: string]: string }) {
        console.log(template, method, data);

        // Only continue if there is an identified caller.
        if (!this.Call.isCallerIdentified()) {
            return;
        }

        const call_type = this.Call.getCallNature().call_type.label;
        const call_reason = this.Call.getCallNature().call_reason.label;

        switch (call_type) {
            case 'Rent':
                this._sentRentComms(call_reason, template, method, data);
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
        this.Call.recordActionDiaryNote(`Rent payment taken: £${amount} ref: ${payment_reference}`);
    }

    /**
     * Handle a comms template sent as a result of the Rent call type.
     */
    _sentRentComms(call_reason: string, template: string, method: string, data: { [propKey: string]: string }) {
        call_reason = call_reason.toLowerCase();
        template = template.toLowerCase();

        switch (call_reason) {
            // switch (template) {
            case 'statement':
                switch (template) {
                    case 'dpa: rent statement (with balance)':
                        console.log('A Statement was sent: record Action Diary note.');
                        this.Call.recordActionDiaryNote('Copy of statement sent');
                        break;
                }
                break;

            case 'refund':
                switch (template) {
                    case 'rent refund form':
                        // A link to a refund form was sent.
                        console.log('A Refund form link was sent: record Action Diary note.');
                        this.Call.recordActionDiaryNote('Refund link sent');
                        break;
                }
                break;

            case 'payment methods':
                // A link to payment methods was sent.
                switch (template) {
                    case 'payment methods':
                        console.log('A Payment methods link was sent: record Action Diary note.');
                        this.Call.recordActionDiaryNote('Copy of statement sent');
                        break;

                    case 'direct debit':
                        console.log('A direct debit form link was sent: record Action Diary note.');
                        this.Call.recordActionDiaryNote('Direct debit form link sent');
                        break;

                    case 'standing order (major works)':
                    case 'standing order (rent)':
                    case 'standing order (service charge)':
                        console.log('Standing order information was sent: record Action Diary note.');
                        this.Call.recordActionDiaryNote('Standing order information sent');
                        break;

                }
                break;
        }
    }

}