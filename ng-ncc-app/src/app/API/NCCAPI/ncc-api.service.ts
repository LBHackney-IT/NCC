import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, take } from 'rxjs/operators';
import { Observable, forkJoin, of, from } from 'rxjs';

import { CRMServiceRequest } from '../../interfaces/crmservicerequest.interface';
import { JSONResponse } from '../../interfaces/json-response.interface';

@Injectable({
    providedIn: 'root'
})

/**
 * NCCAPIService
 * This service is intended to provide functionality for the NCC project.
 */
export class NCCAPIService {

    CALL_TITLE = 'NCC Call';
    CALL_DESCRIPTION = 'Call logged from NCC';
    CALL_SUBJECT = 'bf458845-8cba-e811-814b-e0071b7fe041';

    _url = 'https://sandboxapi.hackney.gov.uk/lbhnccapi/api/';

    constructor(private http: HttpClient) { }

    /**
     * Makes a request to create a new "call" for the specified caller (by their crmContactId).
     */
    createCall(crm_contact_id: string) {
        // NOTE: A gotcha with this endpoint is that it takes GET style parameters instead of via POST.
        const parameters = {
            Title: this.CALL_TITLE,
            Description: this.CALL_DESCRIPTION,
            Subject: this.CALL_SUBJECT,
            ContactId: crm_contact_id
        };

        return this.http
            .post(`${this._url}CRM/CreateServiceRequests?${this._buildQueryString(parameters)}`, {})
            .pipe(
                map((data: JSONResponse) => {
                    return data.response.servicerequest as CRMServiceRequest;
                })
            );
    }

    /**
     * TODO create a generic API service class with this method.
     */
    _buildQueryString(parameters: { [propKey: string]: any }): string {
        const output = Object.keys(parameters).map((key) => `${key}=${encodeURIComponent(parameters[key].toString())}`);
        return output.join('&');
    }

}
