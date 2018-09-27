import { Injectable } from '@angular/core';
import { Caller } from '../interfaces/caller.interface';
import { LogCallSelection } from '../interfaces/log-call-selection.interface';
import { NCCAPIService } from '../API/NCCAPI/ncc-api.service';
import { IdentifiedCaller } from '../classes/identified-caller.class';
import { CRMServiceRequest } from '../interfaces/crmservicerequest.interface';

@Injectable({
    providedIn: 'root'
})
export class CallService {

    // This service manages the current call.
    // It contains the following:
    // - a caller (who could be identified or anonymous);
    // - a call type;
    // - a call reason;
    // - notes relating to the call.

    private caller: Caller;
    private call_nature: LogCallSelection;
    private call_id: string;
    private ticket_number: string;

    constructor(private NCCAPI: NCCAPIService) {
        this.reset();
    }

    /**
     * Returns TRUE if a caller has been defined.
     */
    hasCaller(): boolean {
        return (undefined !== this.caller && null !== this.caller);
    }

    /**
     * Returns TRUE if a caller has been defined.
     */
    hasCallNature(): boolean {
        return !!(this.call_nature);
    }

    /**
     *
     */
    getCallID(): string {
        return this.call_id;
    }

    /**
     * Returns the caller associated with the call.
     */
    getCaller(): Caller {
        return this.caller;
    }

    /**
     * Returns the call type and reason (as their respective IDs).
     */
    getCallNature(): LogCallSelection {
        return this.call_nature;
    }

    /**
     * Sets the caller for this call.
     */
    setCaller(caller: Caller) {
        this.caller = caller;
        console.log('Caller has been set to:', this.caller.getName());
        console.log(`The caller ${caller.isAnonymous() ? 'is' : 'is not'} anonymous.`);

        // Create a call to record notes against.
        // TODO an anonymous caller user is to be created.
        if (caller instanceof IdentifiedCaller) {
            this.NCCAPI.createCall(caller.getContactID())
                .subscribe((data: CRMServiceRequest) => {
                    this.call_id = data.id;
                    this.ticket_number = data.ticketNumber;
                    console.log(`Call ${data.id} was created.`);
                });
        }
    }

    /**
     * Sets the nature (type and reason) of the call.
     */
    setCallNature(selection: LogCallSelection) {
        this.call_nature = selection;
    }

    /**
     * Reset the call to a new state.
     */
    reset() {
        this.caller = null;
        this.call_nature = null;
        this.call_id = null;
        this.ticket_number = null;
        console.log('Call was reset.');
    }

    /**
     * Record a note against the call.
     */
    recordNote(note_content: string, automatic: boolean = false) {
        return this.NCCAPI.createNote(
            this.call_id,
            this.ticket_number,
            this.call_nature.call_reason.id,
            this.caller.getContactID(),
            note_content,
            automatic
        );
    }

}
