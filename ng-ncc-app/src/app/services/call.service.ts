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

    constructor() { }

    getCaller(): Caller {
        return this.caller;
    }

    getCallNature(): LogCallSelection {
        return this.call_nature;
    }

    setCaller(caller: Caller) {
        this.caller = caller;
        console.log('Caller has been set to:', this.caller.getName());
    }

    setCallNature(selection: LogCallSelection) {
        this.call_nature = selection;
    }

}
