import { environment } from '../../../environments/environment';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PAGES } from '../../constants/pages.constant';
import { HackneyAPIService } from '../../API/HackneyAPI/hackney-api.service';
import { ICitizenIndexSearchResult } from '../../interfaces/citizen-index-search-result';
import { IAddressSearchGroupedResult } from '../../interfaces/address-search-grouped-result';
import { IdentifiedCaller } from '../../classes/identified-caller.class';
import { NonTenantCaller } from '../../classes/non-tenant-caller.class';
import { AnonymousCaller } from '../../classes/anonymous-caller.class';
import { ICaller } from '../../interfaces/caller';
import { CallService } from '../../services/call.service';
import { BackLinkService } from '../../services/back-link.service';
import { PageTitleService } from '../../services/page-title.service';

@Component({
    selector: 'app-page-identify',
    templateUrl: './identify.component.html',
    styleUrls: ['./identify.component.css']
})
export class PageIdentifyComponent implements OnInit, OnDestroy {

    private _destroyed$ = new Subject();

    disable_identify_caller: boolean = environment.disable.identifyCaller;
    existing_call: boolean;
    searching: boolean;
    postcode: string;
    results: ICitizenIndexSearchResult[];
    selected_address: IAddressSearchGroupedResult;

    constructor(private router: Router, private HackneyAPI: HackneyAPIService, private Call: CallService,
        private BackLink: BackLinkService, private PageTitle: PageTitleService, private route: ActivatedRoute) { }

    ngOnInit() {
        this.PageTitle.set(PAGES.IDENTIFY.label);

        this.existing_call = false;

        if (this.Call.hasTenancy()) {
            this.existing_call = true;
            this.addressSelected(this.Call.getTenancy());
        }

        // Enable the app's back link if there's no current caller.
        if (!this.Call.hasCaller()) {
            this.BackLink.enable();
            this.BackLink.setTarget(`/${PAGES.LOG_CALL.route}`);
        }
    }

    ngOnDestroy() {
        this._destroyed$.next();
    }

    /**
     * Performs a Citizen Index search.
     */
    performSearch(event: Event) {
        if ((event && event.defaultPrevented) || this.disable_identify_caller || this.searching) {
            return;
        }

        this.selected_address = null;

        this.router.navigate([`./${PAGES.IDENTIFY_ADDRESSES.route}`, { postcode: this.postcode }], { relativeTo: this.route });
    }

    /**
     * Returns TRUE if the user can enter a search term.
     */
    canUseSearch() {
        return !this.disable_identify_caller;
    }

    /**
     * Returns TRUE if the user can peform a search for details.
     */
    canPerformSearch() {
        return this.canUseSearch() && !!(this.postcode);
    }

    /**
     * Called when an address is selected from search results.
     */
    addressSelected(result: IAddressSearchGroupedResult) {
        this.selected_address = result;
    }

    /**
     * Called when a tenant is selected from address results.
     */
    tenantSelected(caller: ICaller) {
        if (caller.isAnonymous()) {
            // We've selected "Not a tenant" (a non-tenant caller).
            console.log('Non-tenant caller.');

            // To be able to obtain the respective tenancy reference, we must have a tenant's CRM ID.
            // We'll use the CRM ID of the first tenant in the list.
            const contact_id = this.selected_address.results[0].crmContactId;
            this.Call.setCaller(new NonTenantCaller(contact_id));
        } else {
            // We've identified a tenant as the caller.
            console.log('Identified caller.');
            this.Call.setCaller(caller);
        }
        this.Call.setTenancy(this.selected_address);
        this.nextStep();
    }

    /**
     * Called when we want to edit a tenant's contact details.
     */
    tenantToEdit(caller: IdentifiedCaller) {
        this.Call.setCaller(caller);
        this.Call.setTenancy(this.selected_address);
        this.router.navigateByUrl(PAGES.EDIT_CONTACT_DETAILS.route);
    }

    /**
     * Called when the user hits the Anonymous caller button..
     */
    anonymousSelected() {
        this.Call.setCaller(new AnonymousCaller);
        this.nextStep();
    }

    /**
     * Returns TRUE if we should display the list of addresses.
     */
    shouldShowAddresses(): boolean {
        return null !== this.results && null === this.selected_address;
    }

    /**
     * Returns TRUE if we should display the list of tenants.
     */
    shouldShowTenants(): boolean {
        return null !== this.selected_address;
    }

    /**
     * Returns TRUE if we should display the DPA warning.
     */
    shouldShowWarning(): boolean {
        if (this.results) {
            return this.results.length > 0;
        }
        return false;
    }

    /**
     * Goes back to the list of addresses from the list of tenants.
     */
    backToAddresses() {
        this.selected_address = null;
    }

    /**
     * Navigats to the next step, having selected a tenant (or an anonymous caller).
     */
    nextStep() {
        if (this.Call.hasCaller()) {
            // If caller is identified the ‘continue' button should take you to ’Caller Notes'.
            // If caller is anonymous the ‘caller is anonymous’ button should take you to ‘General Communications’.
            // Decided in isolation.
            this.router.navigateByUrl(this.Call.isCallerIdentified() ? PAGES.VIEW_NOTES.route : PAGES.COMMS.route);

            // TODO determine which page (comms or payment) to go to, based on the call type and reason.
        }
    }

}
