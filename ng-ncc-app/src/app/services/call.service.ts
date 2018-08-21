import { Injectable } from '@angular/core';
import { Caller } from '../interfaces/caller.interface';
import { LogCallSelection } from '../interfaces/log-call-selection.interface';

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

    constructor() {
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
        console.log(`The caller ${this.caller.isAnonymous() ? 'is' : 'is not'} anonymous.`);
    }

    /**
     * Sets the nature (type and reason) of the call.
     */
    setCallNature(selection: LogCallSelection) {
        this.call_nature = selection;
    }

    reset() {
        this.caller = null;
        this.call_nature = null;
        console.log('Call was reset.');
    }

}
