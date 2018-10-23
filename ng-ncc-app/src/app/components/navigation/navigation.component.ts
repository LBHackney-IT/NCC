// NAVIGATION component.
// <app-navigation></app-navigation>

import { environment } from '../../../environments/environment';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { CallService } from '../../services/call.service';

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {

    constructor(private Call: CallService, private router: Router) { }

    disable_previous_calls: boolean = environment.disable.previousCalls;
    disable_additional_reasons: boolean = environment.disable.additionalCallReason;

    /**
     * "Ends" the current call and navigates to the log call page.
     */
    endCall() {
        this.Call.reset();
        this.router.navigateByUrl('/log-call');
    }

    /**
     * Returns TRUE if a call is currently active.
     * This is used to show/hide the end call link.
     */
    isCallNatureSelected(): boolean {
        return this.Call.hasCallNature();
    }

    /**
     * Returns TRUE if a call is currently active.
     * This is used to show/hide the end call link.
     */
    isCallActive(): boolean {
        return null !== this.Call.getCallID();
    }

    /**
     * Returns TRUE if a call is currently active and the caller has been identified.
     */
    isCallerIdentified() {
        return this.Call.isCallerIdentified();
    }

}
