import { Injectable } from '@angular/core';
import { Observavle, of } from 'rxjs';
import { finalize, map } from 'rxjs/operators';


import { HackneyAPIService } from '../API/HackneyAPI/hackney-api.service';
import { ICitizenIndexSearchResult } from '../interfaces/citizen-index-search-result';

@Injectable({
    providedIn: 'root'
})
export class AddressSearchService {

    // This service is used to store information about an address search, used by a few components.

    private _searching: boolean;
    private _postcode: string;
    private _addresses: ICitizenIndexSearchResult[];
    private _error: boolean;

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
     *
     */
    setPostcode(postcode: string) {
        this._postcode = postcode;
    }

    /**
     *
     */
    isSearching(): boolean {
        return this._searching;
    }

    /**
     *
     */
    performSearch(): Observable<void> {
        if (this._searching) {
            return;
        }

        this._searching = true;
        this._addresses = null;
        return this.HackneyAPI.getCitizenIndexSearch(null, null, null, this._postcode)
            .pipe(finalize(() => {
                this._searching = false;
            }))
            .pipe(map((results) => {
                this._addresses = results;
            }));
    }

    /**
     *
     */
    getAddressResults(): ICitizenIndexSearchResult[] {
        return this._addresses;
    }

}
