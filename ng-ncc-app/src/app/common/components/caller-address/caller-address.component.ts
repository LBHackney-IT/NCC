import { Component, OnInit } from '@angular/core';

import { CallService } from '../../services/call.service';

@Component({
    selector: 'app-caller-address',
    templateUrl: './caller-address.component.html',
    styleUrls: ['./caller-address.component.scss']
})
export class CallerAddressComponent {

    constructor(private Call: CallService) { }

    /**
     *
     */
    get address(): string | null {
        if (this.Call.hasCaller()) {
            return this.isCallerAnonymous() ? null : this.Call.getTenancy().address;
        }
    }

    /**
     *
     */
    isCallerAnonymous() {
        return this.Call.hasCaller() && !this.Call.isCallerIdentified();
    }

}
