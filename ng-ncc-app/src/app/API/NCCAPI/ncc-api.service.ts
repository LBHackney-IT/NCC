import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, take } from 'rxjs/operators';
import { Observable, forkJoin, of, from } from 'rxjs';

import * as moment from 'moment';

import { CRMServiceRequest } from '../../interfaces/crmservicerequest.interface';
import { JSONResponse } from '../../interfaces/json-response.interface';
import { NCCNote } from '../../interfaces/ncc-note.interface';
import { NCCUHNote } from '../../interfaces/ncc-uh-note.interface';
import { ContactDetailsUpdate } from '../../classes/contact-details-update.class';
import { NOTES } from '../../constants/notes.constant';

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

    _url = 'https://sandboxapi.hackney.gov.uk/lbhnccapi/api/';

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
            .post(`${this._url}CRM/CreateServiceRequests?${this._buildQueryString(parameters)}`, {})
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
            .post(`${this._url}CRM/CreateNCCInteractions?${this._buildQueryString(parameters)}`, {});
    }

    /**
     * Fetches a list of notes associated with the specified CRM contact ID.
     */
    getNotes(crm_contact_id: string) {
        const parameters = {
            contactid: crm_contact_id,
        };

        return this.http
            .get(`${this._url}CRM/GetAllNCCInteractions?${this._buildQueryString(parameters)}`, {})
            .pipe(map((data: JSONResponse) => {
                return data ? data.results as NCCNote[] : [];
            }));
    }

    /**
     * Fetches a list of Action Diary entries and notes associated with the specified CRM contact ID.
     * This also requires a housing reference, which isn't currently provided.
     */
    getDiaryAndNotes(crm_contact_id: string) {
        const parameters = {
            contactId: crm_contact_id
        };

        return this.http
            .get(`${this._url}UH/GetAllActionDiaryAndNotes?${this._buildQueryString(parameters)}`, {})
            .pipe(map((data: JSONResponse) => {
                // data should be an array with a single item, representing all the notes associated with the CRM contact ID.
                const rows = data[0];
                if (!rows) {
                    return [];
                }

                const notes: NCCUHNote[] = rows.map((row) => {
                    // Format the created on date ahead of time.
                    // We're using moment.js fo this, because Angular's DatePipe behaves inconsistently - often giving an error.
                    let date;
                    if (NOTES.TYPE_ACTION_DIARY === row.notesType) {
                        // Action Diary entries have a preformatted date, but moment.js can't interpret it without help.
                        date = moment(row.createdOn, 'DD/MM/YYYY hh:mm');
                    } else {
                        date = moment(row.createdOn);
                        row.createdOn = date.format('DD/MM/YYYY hh:mm');
                    }

                    // We also want the date formatted differently for sorting purposes.
                    row.createdOnSort = date.format('YYYYMMDDhhmm');

                    return row;
                });

                // Sort the notes by their creation date (descending order).
                notes.sort((a: NCCUHNote, b: NCCUHNote) => {
                    if (a.createdOnSort > b.createdOnSort) {
                        return -1;
                    }
                    if (a.createdOnSort < b.createdOnSort) {
                        return 1;
                    }
                    return 0;
                });

                return notes;
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
            .post(`${this._url}CRM/SetDefaultComms?${this._buildQueryString(parameters)}`, {});
    }

    /**
     * Obtains contact details for a person, including defaults.
     */
    getContactDetails(crm_contact_id: string) {
        const parameters = {
            contactid: crm_contact_id
        };

        return this.http
            .get(`${this._url}CRM/GetCitizenCommunication?${this._buildQueryString(parameters)}`, {})
            .pipe(map((data: JSONResponse) => {
                return JSON.parse(data.response.communicationdetails) as ContactDetailsUpdate;
            }));
    }

    /**
     * TODO create a generic API service class with this method.
     */
    _buildQueryString(parameters: { [propKey: string]: any }): string {
        const output = Object.keys(parameters).map((key) => -1 === [undefined, null].indexOf(parameters[key]) ?
            `${key}=${encodeURIComponent(parameters[key].toString())}` : null);
        return output.join('&');
    }

}
