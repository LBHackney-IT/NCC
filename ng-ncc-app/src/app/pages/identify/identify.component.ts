import { Component, OnInit } from '@angular/core';
import { HackneyAPIService } from '../../API/HackneyAPI/hackney-api.service';
import { CitizenIndexSearchResult } from '../../interfaces/citizen-index-search-result.interface';
import { AddressSearchGroupedResult } from '../../interfaces/address-search-grouped-result.interface';
import { IdentifiedCaller } from '../../classes/identified-caller.class';
import { AnonymousCaller } from '../../classes/anonymous-caller.class';
import { Caller } from '../../interfaces/caller.interface';
import { CallService } from '../../services/call.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-page-identify',
    templateUrl: './identify.component.html',
    styleUrls: ['./identify.component.css']
})
export class PageIdentifyComponent implements OnInit {

    _searching: boolean;
    postcode: string;
    results: CitizenIndexSearchResult[];
    selected_address: AddressSearchGroupedResult;

    constructor(private router: Router, private HackneyAPI: HackneyAPIService, private Call: CallService) { }

    ngOnInit() {
        this._searching = false;
    }

    /**
     * Performs a Citizen Index search.
     */
    performSearch() {
        // For the time being, we are only searching for people by postcode.
        if (this._searching) {
            return;
        }
        this.results = null;
        this.selected_address = null;
        this._searching = true;

        const subscription = this.HackneyAPI.getCitizenIndexSearch(null, null, null, this.postcode)
            .subscribe(
                (rows) => {
                    this.results = rows;
                },
                (error) => {
                    console.error(error);
                },
                () => {
                    this._searching = false;
                    subscription.unsubscribe();
                }
            );
    }

    /**
     * Returns TRUE if the user can peform a search for details.
     */
    canPerformSearch() {
        return !this._searching && !!(this.postcode);
    }

    /**
     * Called when an address is selected from search results.
     */
    addressSelected(result: AddressSearchGroupedResult) {
        this.selected_address = result;
    }

    /**
     * Called when a tenant is selected from address results.
     */
    tenantSelected(caller: IdentifiedCaller) {
        this.Call.setCaller(caller);
        this.nextStep();
    }

    /**
     * Called when we want to edit a tenant's contact details.
     */
    tenantToEdit(caller: IdentifiedCaller) {
        this.Call.setCaller(caller);
        this.router.navigateByUrl('contact-details');
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

    nextStep() {
        if (this.Call.hasCaller()) {
            this.router.navigateByUrl('comms');
            // TODO determine which page (comms or payment) to go to, based on the call type and reason.
        }
    }

}
