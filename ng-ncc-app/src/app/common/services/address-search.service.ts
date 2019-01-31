import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { ReplaySubject, Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';


import { ManageATenancyAPIService } from '../../common/API/ManageATenancyAPI/manageatenancy-api.service';
import { IAddressSearchGroupedResult } from '../../common/interfaces/address-search-grouped-result';
import { ICitizenIndexSearchResult } from '../../common/interfaces/citizen-index-search-result';

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

    // We're using a ReplaySubject to provide address search results.
    // ReplaySubjects will provide the last value given to it, if available,
    // so we can return to this subpage with any search results displayed.
    // see http://reactivex.io/documentation/subject.html
    private _resultsSubject = new ReplaySubject();

    constructor(private ManageATenancyAPI: ManageATenancyAPIService) { }

    /**
     * Resets address search information.
     */
    reset() {
        this._searching = false;
        this._postcode = null;
        this._error = false;
        this._addresses = null;
        this._address = null;
        this._resultsSubject = new ReplaySubject();
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
        const isAdvanceSearch = !environment.disable.advanceSearch;
        // (i.e. if environment.disable.advanceSearch is set to FALSE,
        // TRUE will be passed to ManageATenancyAPI.getCitizenIndexSearch().)

        this._searching = true;
        this._addresses = null;
        this._error = false;

        return this.ManageATenancyAPI.getCitizenIndexSearch(null, null, null, this._postcode, isAdvanceSearch)
            .pipe(finalize(() => {
                // The finalize pipe is triggered when the Observable is completed,
                // whether resolved or rejected. It's equivalent to finally() for Promises.
                this._searching = false;
            }))
            .pipe(
                map(results => {
                    // When the Observable is successful, we store the results in this._addresses.
                    this._addresses = results;

                    // We also update the results subject, so that anything subscribed to the subject will be notified of updates.
                    this._resultsSubject.next(this._addresses);
                }),
                catchError((err, caught) => {
                    // If an error (e.g. server error) occurred.
                    this._error = true;
                    this._resultsSubject.next(null);
                    // We don't want to use this._resultsSubject.error() as it will kill the stream.
                    return of([]);
                })
            );
    }


    /**
     * Returns a ReplaySubject, which provides the search results when generated.
     */
    getAddressResults() {
        return this._resultsSubject;
    }

    hasError(): boolean {
        return this._error;
    }

}
