import { environment } from '../../../environments/environment';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, of, from } from 'rxjs';

import { IAccountDetails } from '../../interfaces/account-details';
import { IAccountDetailsByReference } from '../../interfaces/account-details-by-reference';
import { ICitizenIndexSearchResult } from '../../interfaces/citizen-index-search-result';
import { IContactDetails } from '../../interfaces/contact-details';
import { IJSONResponse } from '../../interfaces/json-response';
import { ITransaction } from '../../interfaces/transaction';

@Injectable({
    providedIn: 'root'
})

/**
 * ManageATenancyAPIService
 * This service is intended to provide access to the Hackney Manage A Tenancy API.
 */
export class ManageATenancyAPIService {

    // TODO these API services can extend a general class.

    _url = environment.api.manageATenancy;

    constructor(private http: HttpClient) { }

    /**
     * Returns account details for the specified CRM contact ID (for a tenant).
     */
    getAccountDetails(crm_contact_id: string) {
        return this.http
            .get(`${this._url}/Accounts/AccountDetailsByContactId?contactid=${crm_contact_id}`)
            .pipe(
                map((data: any) => {
                    // We should have just one result, containing a bunch of information.
                    // TODO how do we handle having no information?
                    const account: IAccountDetails = data.results;

                    // For consistency across the app, the current balance returned from the API has to be reversed.
                    account.currentBalance = -account.currentBalance;
                    return account;
                })
            );
    }

    /**
     * Get account details for a tenancy by a reference.
     * The reference can be either the tenancy (tag) reference or a Paris payment reference.
     */
    getAccountDetailsByReference(reference: string): Observable<IAccountDetailsByReference> {
        return this.http
            .get(`${this._url}/Accounts/AccountDetailsByPaymentorTagReference?referencenumber=${reference}`, {})
            .pipe(map((data: IJSONResponse) => data.results[0]));
    }

    /**
     * Returns contact details for the specified CRM contact ID (for a tenant).
     * There are subtle differences between the details returned from this endpoint and those from the Hackney API,
     * for example the presence of a title value.
     */
    getContactDetails(crm_contact_id: string) {
        return this.http
            .get(`${this._url}/Contacts/GetContactDetails?contactid=${crm_contact_id}`)
            .pipe(
                map((data) => {
                    return data as IContactDetails;
                })
            );
    }

    /**
     * Returns a list of transactions for the specified tenancy reference.
     */
    getTransactions(tenancy_reference: string) {
        // The tag reference parameter is the tenancy reference.
        return this.http
            // .get(`${this._url}/Transactions?tagReference=${tenancy_reference}`)
            .get(`https://api.hackney.gov.uk/manageatenancy/v1/Transactions?tagReference=${tenancy_reference}`)
            .pipe(
                map((data: IJSONResponse) => {
                    const details: ITransaction[] = Array.from(data.results);

                    return details;
                })
            );
    }

    /**
     * Searches for citizens and returns a list of results.
     */
    getCitizenIndexSearch(first_name: string, last_name: string, address: string, postcode: string,
        advanceSearch: boolean = false):
        Observable<ICitizenIndexSearchResult[]> {

        // Build the query part of the URL.
        let query = '';
        if (first_name) { query += `firstname=${first_name}`; }
        if (last_name) { query += `surname=${last_name}`; }
        if (address) { query += `addressline12=${address}`; }
        if (postcode) { query += `postcode=${postcode}`; }
        query += `&IsAdvanceSearch=${advanceSearch ? 'true' : 'false'}`;
        // very important to set IsAdvanceSearch to false.

        return this.http
            .get(`${this._url}/CitizenIndexSearch?${query}`)
            .pipe(
                map((response: IJSONResponse) => {
                    // TODO perhaps filter out any unwanted/unnecessary information.
                    return response.results;
                })
            );
    }

}
