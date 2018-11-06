import { environment } from '../../../environments/environment';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PAGES } from '../../constants/pages.constant';
import { HackneyAPIService } from '../../API/HackneyAPI/hackney-api.service';
import { ICitizenIndexSearchResult } from '../../interfaces/citizen-index-search-result';
import { IAddressSearchGroupedResult } from '../../interfaces/address-search-grouped-result';
import { IdentifiedCaller } from '../../classes/identified-caller.class';
import { AnonymousCaller } from '../../classes/anonymous-caller.class';
import { ICaller } from '../../interfaces/caller';
import { CallService } from '../../services/call.service';
import { BackLinkService } from '../../services/back-link.service';

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
        private BackLink: BackLinkService) { }

    ngOnInit() {
        this.searching = false;
        this.existing_call = false;

        if (this.Call.hasTenancy()) {
            this.existing_call = true;
            this.addressSelected(this.Call.getTenancy());
        }

        // Enable the app's back link if there's no current caller.
        if (!this.Call.hasCaller()) {
            this.BackLink.enable();
            this.BackLink.setTarget('/log-call');
        }
    }

    ngOnDestroy() {
        this._destroyed$.next();
    }

    /**
     * Performs a Citizen Index search.
     */
    performSearch() {
        if (this.disable_identify_caller || this.searching) {
            return;
        }

        this.results = null;
        this.selected_address = null;
        this.searching = true;

        const subscription = this.HackneyAPI.getCitizenIndexSearch(null, null, null, this.postcode)
            .pipe(
                takeUntil(this._destroyed$)
            )
            .subscribe(
                (rows) => {
                    this.results = rows;
                },
                (error) => {
                    console.error(error);
                },
                () => {
                    this.searching = false;
                    subscription.unsubscribe();
                }
            );
    }

    /**
     * Returns TRUE if the user can enter a search term.
     */
    canUseSearch() {
        return !(this.disable_identify_caller || this.searching);
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
    tenantSelected(caller: IdentifiedCaller) {
        this.Call.setCaller(caller);
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
            this.router.navigateByUrl(PAGES.COMMS.route);
            // TODO determine which page (comms or payment) to go to, based on the call type and reason.
        }
    }

}
