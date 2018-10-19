import { environment } from '../../../environments/environment';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, of, from } from 'rxjs';

import { IJSONResponse } from '../../interfaces/json-response';
import { IAccountDetails } from '../../interfaces/account-details';
import { IContactDetails } from '../../interfaces/contact-details';
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
                    return data.results as IAccountDetails;
                },
                    (error) => {
                        console.log('Error fetching account details:', error);
                    })
            );
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
            .get(`${this._url}/Transactions?tagReference=${tenancy_reference}`)
            .pipe(
                map((data: IJSONResponse) => {
                    const details: ITransaction[] = Array.from(data.results);

                    return details;
                },
                    (error) => {
                        console.log('Error fetching transactions:', error);
                    })
            );
    }

}
