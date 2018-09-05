import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, of, from } from 'rxjs';

import { JSONResponse } from '../../interfaces/json-response.interface';
import { AccountDetails } from '../../interfaces/account-details.interface';
import { Transaction } from '../../interfaces/transaction.interface';

@Injectable({
    providedIn: 'root'
})

/**
 * ManageATenancyAPIService
 * This service is intended to provide access to the Hackney Manage A Tenancy API.
 */
export class ManageATenancyAPIService {

    // TODO these API services can extend a general class.

    _url = 'https://sandboxapi.hackney.gov.uk/manageatenancy';

    constructor(private http: HttpClient) { }

    /**
     * Returns account details for the specified contact ID (for a tenant).
     */
    getAccountDetails(contact_id: string) {
        return this.http
            .get(`${this._url}/v1/Accounts/AccountDetailsByContactId?contactid=${contact_id}`)
            .pipe(
                map((data: JSONResponse) => {
                    // We should have just one result, containing a bunch of information.
                    // TODO how do we handle having no information?
                    const details: AccountDetails = Array.from(data.results)[0];

                    return details;
                },
                    (error) => {
                        console.log('Error fetching account details:', error);
                    })
            );
    }

    /**
     * Returns a list of transactions for the specified tenancy reference.
     */
    getTransactions(tenancy_reference: string) {
        // The tag reference parameter is the tenancy reference.
        return this.http
            .get(`${this._url}/v1/Transactions?tagReference=${tenancy_reference}`)
            .pipe(
                map((data: JSONResponse) => {
                    const details: Transaction[] = Array.from(data.results);

                    return details;
                },
                    (error) => {
                        console.log('Error fetching transactions:', error);
                    })
            );
    }

}
