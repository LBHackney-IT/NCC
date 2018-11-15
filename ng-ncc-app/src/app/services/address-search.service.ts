import { Injectable } from '@angular/core';
import { Subject, Observable, of } from 'rxjs';
import { finalize, map } from 'rxjs/operators';


import { HackneyAPIService } from '../API/HackneyAPI/hackney-api.service';
import { IAddressSearchGroupedResult } from '../interfaces/address-search-grouped-result';
import { ICitizenIndexSearchResult } from '../interfaces/citizen-index-search-result';

@Injectable({
    providedIn: 'root'
})
export class AddressSearchService {
    // This service is used to store information about an address search, and is used by the "identify" pages.

    private _searching: boolean;
    private _postcode: string;
    private _addresses: ICitizenIndexSearchResult[];
    private _address: IAddressSearchGroupedResult;
    private _error: boolean;
    private _subscription: Observable<void>;
    private _resultsSubject = new Subject();

    constructor(private HackneyAPI: HackneyAPIService) { }

    /**
     * Resets address search information.
     */
    reset() {
        this._searching = false;
        this._postcode = null;
        this._error = false;
        this._addresses = null;
    }

    /**
     * Sets the postcode to use for an address search.
     */
    setPostcode(postcode: string) {
        this._postcode = postcode;
    }

    /**
     * Sets the address to use for tenant results.
     */
    setAddress(address: IAddressSearchGroupedResult) {
        this._address = address;
    }

    /**
     * Returns the address used for tenant results.
     */
    getAddress(): IAddressSearchGroupedResult {
        return this._address;
    }

    /**
     * Returns TRUE if this service is performing a search.
     */
    isSearching(): boolean {
        return this._searching;
    }

    /**
     * Performs an address search based on a set postcode.
     */
    performSearch() {
        this._searching = true;
        this._addresses = null;

        return this.HackneyAPI.getCitizenIndexSearch(null, null, null, this._postcode)
            .pipe(finalize(() => {
                // The finalize pipe is triggered when the Observable is completed,
                // whether resolved or rejected. It's equivalent to finally() for Promises.
                this._searching = false;
            }))
            .pipe(map((results) => {
                // When the Observable is successful, we store the results in this._addresses.
                this._addresses = results;

                // We also update the results subject, so that anything subscribed to the subject will be notified of updates.
                this._resultsSubject.next(this._addresses);
            }));
    }


    /**
     * Returns a Subject, which provides the search results when generated.
     */
    getAddressResults(): Subject {
        return this._resultsSubject;
    }

}
