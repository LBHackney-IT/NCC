import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, take } from 'rxjs/operators';
import { Observable, forkJoin, of, from } from 'rxjs';

import { CRMServiceRequest } from '../../interfaces/crmservicerequest.interface';
import { JSONResponse } from '../../interfaces/json-response.interface';
import { NCCNote } from '../../interfaces/ncc-note.interface';
import { ContactDetailsUpdate } from '../../classes/contact-details-update.class';

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

    NOTE_TYPE_AUTOMATIC = 1;
    NOTE_TYPE_MANUAL = 2;

    _url = 'https://sandboxapi.hackney.gov.uk/lbhnccapi/api/CRM/';

    constructor(private http: HttpClient) { }

    /**
     * Makes a request to create a new "call" for the specified caller (by their crmContactId).
     */
    createCall(crm_contact_id: string) {
        const parameters = {
            Title: this.CALL_TITLE,
            Description: this.CALL_DESCRIPTION,
            Subject: this.CALL_SUBJECT,
            ContactId: crm_contact_id
        };

        return this.http
            .post(`${this._url}CreateServiceRequests?${this._buildQueryString(parameters)}`, {})
            .pipe(
                map((data: JSONResponse) => {
                    return data.response.servicerequest as CRMServiceRequest;
                })
            );
    }

    /**
     * Create a note against a call.
     */
    createNote(call_id: string, ticket_number: string, call_reason_id: string, crm_contact_id: string, content: string,
        automatic: boolean = false) {
        const parameters = {
            callReasonId: call_reason_id,
            'ServiceRequest.Id': call_id,
            'ServiceRequest.TicketNumber': ticket_number,
            'ServiceRequest.ContactId': crm_contact_id,
            notestype: automatic ? this.NOTE_TYPE_AUTOMATIC : this.NOTE_TYPE_MANUAL,
            notes: content
        };

        return this.http
            .post(`${this._url}CreateNCCInteractions?${this._buildQueryString(parameters)}`, {});
    }

    getNotes(crm_contact_id: string) {
        const parameters = {
            contactid: crm_contact_id,
        };

        return this.http
            .get(`${this._url}GetAllNCCInteractions?${this._buildQueryString(parameters)}`, {})
            .pipe(map((data: JSONResponse) => {
                return data ? data.results as NCCNote[] : [];
            }));
    }

    /**
     * Saves contact details for a person, including default information.
     */
    saveContactDetails(crm_contact_id: string, details: ContactDetailsUpdate) {
        const parameters = {
            contactid: crm_contact_id,
            CommObject: JSON.stringify(details)
        };

        return this.http
            .post(`${this._url}SetDefaultComms?${this._buildQueryString(parameters)}`, {});
    }

    /**
     * Obtains contact details for a person, including defaults.
     */
    getContactDetails(crm_contact_id: string) {
        const parameters = {
            contactid: crm_contact_id
        };

        return this.http
            .get(`${this._url}GetCitizenCommunication?${this._buildQueryString(parameters)}`, {})
            .pipe(map((data: JSONResponse) => {
                return JSON.parse(data.response.communicationdetails) as ContactDetailsUpdate;
            }));
    }

    /**
     * TODO create a generic API service class with this method.
     */
    _buildQueryString(parameters: { [propKey: string]: any }): string {
        const output = Object.keys(parameters).map((key) => undefined !== parameters[key] ?
            `${key}=${encodeURIComponent(parameters[key].toString())}` : null);
        return output.join('&');
    }

}