import { Component, Input } from '@angular/core';

import { CallService } from '../../services/call.service';

@Component({
    selector: 'app-current-caller',
    templateUrl: './current-caller.component.html',
    styleUrls: ['./current-caller.component.scss']
})
export class CurrentCallerComponent {
    @Input() withPrefix: boolean;
    @Input() allowAnonymous: boolean;

    constructor(private Call: CallService) { }

    /**
     *
     */
    getCallerName(): string | null {
        if (this.Call.hasCaller()) {
            return this.Call.getCaller().getName();
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
     * Returns TRUE if the current caller is anonymous (but NOT a non-tenant).
     */
    isCallerAnonymous() {
        return !this.isCallerIdentified() && !this.Call.isCallerNonTenant();
    }

    /**
     * Returns TRUE if the current caller is identified.
     */
    isCallerIdentified() {
        return this.Call.hasCaller() && this.Call.isCallerIdentified();
    }

}
