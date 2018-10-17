import { Component } from '@angular/core';

import { CallService } from '../../services/call.service';

@Component({
    selector: 'app-current-caller',
    templateUrl: './current-caller.component.html',
    styleUrls: ['./current-caller.component.scss']
})
export class CurrentCallerComponent {

    constructor(private Call: CallService) { }

    /**
     *
     */
    getCallerName(): string | null {
        if (this.Call.hasCaller()) {
            return this.Call.isCallerIdentified() ? this.Call.getCaller().getName() : 'anonymous';
        }
        return null;
    }

    /**
     *
     */
    hasCaller(): boolean {
        return this.Call.hasCaller();
    }

    /**
     *
     */
    isCallerAnonymous() {
        return this.Call.hasCaller() && !this.Call.isCallerIdentified();
    }

}
