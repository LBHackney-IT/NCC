// NAVIGATION component.
// <app-navigation></app-navigation>

import { environment } from '../../../environments/environment';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { CallService } from '../../services/call.service';
import { PAGES } from '../../constants/pages.constant';

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {

    constructor(private Call: CallService, private router: Router) { }

    page_defs = PAGES;
    previous_call_count: number = environment.previousCallCount;
    disable_previous_calls: boolean = environment.disable.previousCalls;
    disable_additional_reasons: boolean = environment.disable.additionalCallReason;

    /**
     * "Ends" the current call and navigates to the log call page.
     */
    endCall() {
        this.Call.reset();
        this.router.navigateByUrl(PAGES.PREVIOUS_CALLS.route);
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
     * Returns TRUE if we've started a call.
     * A call has been started if we have both a caller and a call nature (type and reason).
     */
    hasCallStarted(): boolean {
        return this.isCallNatureSelected && this.Call.hasCaller();
    }

    /**
     * Returns TRUE if a call is currently active and the caller has been identified.
     */
    isCallerIdentified(): boolean {
        return this.Call.isCallerIdentified();
    }

    /**
     * Returns TRUE if a call is currently active and the caller is able to make a payment.
     */
    isCallerAbleToPay(): boolean {
        return this.Call.isCallerIdentified() || this.Call.isCallerNonTenant();
    }

    /**
     *
     */
    getIdentifyRoute(): string {
        const page = this.Call.hasTenancy() ? `${PAGES.IDENTIFY.route}/${PAGES.IDENTIFY_TENANTS.route}` : PAGES.IDENTIFY.route;
        return page;
    }

    /**
     *
     */
    getRentRoute(): string {
        const page = this.Call.isCallerNonTenant() ? PAGES.RENT_PAYMENT.route : PAGES.RENT_SUMMARY.route;
        return `${PAGES.RENT.route}/${page}`;
    }

}
