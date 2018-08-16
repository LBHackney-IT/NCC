import { Component, OnInit } from '@angular/core';
import { HackneyAPIService } from '../../API/HackneyAPI/hackney-api.service';
import { CitizenIndexSearchResult } from '../../interfaces/citizen-index-search-result.interface';
import { AddressSearchGroupedResult } from '../../interfaces/address-search-grouped-result.interface';
import { IdentifiedCaller } from '../../classes/identified-caller.class';
import { AnonymousCaller } from '../../classes/anonymous-caller.class';
import { Caller } from '../../interfaces/caller.interface';

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

    constructor(private HackneyAPI: HackneyAPIService) { }

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

        let subscription = this.HackneyAPI.getCitizenIndexSearch(null, null, null, this.postcode)
            .subscribe(
                (rows) => {
                    this._searching = false;
                    this.results = rows;
                },
                (error) => {
                    console.error(error);
                },
                () => {
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
        alert(`Identified the caller as ${caller.getName()}.`);
        this._outputCaller(caller);
    }

    /**
     * Called when the user hits the Anonymous caller button..
     */
    anonymousSelected() {
        const caller = new AnonymousCaller;
        alert('Caller is anonymous.');
        this._outputCaller(caller);
    }

    _outputCaller(caller: Caller) {
        console.log(`Caller's name is ${caller.getName() || 'not present'}.`);
        console.log('Caller\'s email addresses:', caller.getEmailAddresses());
        console.log('Caller\'s telephone numbers:', caller.getTelephoneNumbers());
        console.log('Is the caller anonymous?', caller.isAnonymous());
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
     * Goes back to the list of addresses from the list of tenants.
     */
    backToAddresses() {
        this.selected_address = null;
    }

}
