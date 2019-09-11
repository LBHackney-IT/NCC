import { environment } from '../../../../environments/environment';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import * as moment from 'moment';

import { ContactDetailsUpdate } from '../../classes/contact-details-update.class';
import { IAuthentication } from '../../interfaces/authentication';
import { ICallbackDetails } from '../../interfaces/callback-details';
import { ICallbackNoteParameters } from '../../interfaces/callback-note-parameters';
import { ICallbackResponse } from '../../interfaces/callback-response';
import { ICRMServiceRequest } from '../../interfaces/crmservicerequest';
import { IJSONResponse } from '../../interfaces/json-response';
import { INCCNote } from '../../interfaces/ncc-note';
import { INCCUHNote } from '../../interfaces/ncc-uh-note';
import { INotesSettings } from '../../interfaces/notes-settings';
import { IRentBreakdown } from '../../interfaces/rent-breakdown';
import { ITenancyAgreementDetails } from '../../interfaces/tenancy-agreement-details';
import { ITenancyTransactionRow } from '../../interfaces/tenancy-transaction-row';
import { NOTES } from '../../constants/notes.constant';
import { NOTE_TYPE } from '../../constants/note-type.constant';
import { CALLBACK_SUCCESS } from '../../constants/callback-success.constant';
import { HelperService } from '../../services/helper.service';
import { IActiveDirectoryUserResult } from '../../interfaces/active-directory-user-result';
import { LogCallType } from '../../classes/log-call-type.class';
import { IHackneyAPIJSONResult } from '../../interfaces/hackney-api-json-result';
import { LogCallReason } from '../../classes/log-call-reason.class';

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

    _url = environment.api.ncc;

    constructor(private Helper: HelperService, private http: HttpClient) { }

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
                map((data: IJSONResponse) => {
                    return data.response.servicerequest as ICRMServiceRequest;
                })
            );
    }

    /**
     * Create a manual note against a call.
     */
    createManualNote(agentCRMID: string, settings: INotesSettings) {
        return this._createNote(agentCRMID, settings, NOTE_TYPE.MANUAL);
    }

    /**
     * Create an automatic note against a call.
     * Automatic notes are also added to the UH Notes.
     */
    createAutomaticNote(agentCRMID: string, settings: INotesSettings) {
        return this._createNote(agentCRMID, settings, NOTE_TYPE.AUTOMATIC);
    }

    /**
     * Create a callback request note against a call.
     */
    createCallbackNote(agentCRMID: string, settings: INotesSettings, details: ICallbackNoteParameters) {
        const emails = [details.recipientEmail, details.managerEmail].filter(e => null !== e);

        // The callback request is considered sent to the first specified email address,
        // with any other email addresses being carbon copied (CC'd).
        const firstEmail = emails.shift();
        let noteMessage = `Callback request sent to: ${firstEmail}`;
        if (emails.length) {
            noteMessage += `\nCC'd to: ${emails.join(', ')}`;
        }
        noteMessage += `\n${details.message}`;

        settings.parameters = Object.assign({}, {
            Notes: noteMessage,
            'CallbackRequest.Address': details.address,
            'CallbackRequest.AgentName': details.fromName,
            'CallbackRequest.MessageForEmail': details.message,
            'CallbackRequest.CallersFullname': details.callerName,
            'CallbackRequest.RecipientEmailId': details.recipientEmail,
            'CallbackRequest.ManagerEmailId': details.managerEmail,
            'CallbackRequest.PhoneNumber': details.callbackNumber,
            'CallbackRequest.OtherNumber': details.otherNumber,
        }, settings.parameters);
        return this._createNote(agentCRMID, settings, NOTE_TYPE.CALLBACK);
    }

    /**
     * Create a callback note against a call.
     */
    createCallbackResponse(response: ICallbackResponse) {
        const responseStatus = response.gotThrough ? 'Callback successful' : 'Callback unsuccessful';
        const responseMessage = `${responseStatus}\n${response.notes}\nOfficer: ${response.responseBy}`;
        const settings: INotesSettings = {
            call_id: response.serviceRequestId,
            ticket_number: response.ticketNumber,
            call_reason_id: response.callReasonId,
            other_reason: response.otherReason,
            existing_repair_contractor_reason: response.existingRepairContractorReason,
            crm_contact_id: response.contactId,
            content: responseMessage,
            tenancy_reference: response.tenancyReference,
            parameters: {
                InteractionId: response.callbackId,
                'CallbackRequest.CallBackId': response.callbackId,
                'CallbackRequest.Response': response.gotThrough ? CALLBACK_SUCCESS.YES : CALLBACK_SUCCESS.NO,
                'CallbackRequest.ResponseBy': response.responseBy,
            }
        };
        return this._createNote(null, settings, NOTE_TYPE.CALLBACK);
    }

    /**
     * Create a note.
     */
    _createNote(agentCRMID: string, settings: INotesSettings, noteType: number = NOTE_TYPE.MANUAL) {
        const parameters = Object.assign({
            CallReasonId: settings.call_reason_id || '',
            OtherReason: settings.other_reason,
            ExistingRepairContractorReason: settings.existing_repair_contractor_reason,
            'ServiceRequest.Id': settings.call_id,
            'ServiceRequest.TicketNumber': settings.ticket_number,
            'ServiceRequest.ContactId': settings.crm_contact_id,
            'ServiceRequest.CreatedBy': agentCRMID,
            Notestype: noteType,
            Notes: settings.content,
            CallTransferred: settings.calltransferred,
            HousingTagRef: settings.tenancy_reference
        }, settings.parameters);

        return this.http
            .post(`${this._url}CRM/CreateNCCInteractions?${this._buildQueryString(parameters)}`, {});
    }

    /**
     *
     *
     * @param {string} tenancyReference
     * @param {string} content
     * @param {string} username
     * @returns
     * @memberof NCCAPIService
     */
    addTenancyAgreementNotes(tenancyReference: string, content: string, username: string) {
        const parameters = {
            tenancyAgreementId: tenancyReference,
            notes: content,
            username: username
        };

        return this.http
            .post(`${this._url}UH/AddTenancyAgreementNotes?${this._buildQueryString(parameters)}`, {});
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
            .pipe(map((data: IJSONResponse) => {
                return data ? data.results as INCCNote[] : [];
            }));
    }

    /**
     * Fetches a list of Action Diary entries and notes associated with the specified CRM contact ID.
     * This also requires a housing reference, which isn't currently provided.
     */
    getDiaryAndNotes(tenancyReference: string) {
        const parameters = {
            housingRef: tenancyReference
        };

        return this.http
            .get(`${this._url}UH/GetAllActionDiaryAndNotes?${this._buildQueryString(parameters)}`, {})
            .pipe(map((data: IJSONResponse) => {
                // data should be an array with a single item, representing all the notes associated with the CRM contact ID.
                const rows = data[0];
                if (!rows) {
                    return [];
                }

                const notes: INCCUHNote[] = rows.map((row) => {
                    // Format the created on date ahead of time.
                    // We're using moment.js fo this, because Angular's DatePipe behaves inconsistently - often giving an error.
                    let date;
                    switch (row.notesType) {
                        case NOTES.TYPE_ACTION_DIARY:
                        case NOTES.TYPE_UH:
                            // Action Diary and Universal Housing notes entries have a preformatted date,
                            // but moment.js can't interpret them without help.
                            date = moment(row.createdOn, 'DD/MM/YYYY HH:mm');
                            break;
                        default:
                            date = moment(row.createdOn);
                    }
                    row.createdOn = date.format('DD/MM/YYYY HH:mm');

                    // We also want the date formatted differently for sorting purposes.
                    row.createdOnSort = date.format('YYYYMMDDHHmmss');

                    return row;
                });

                // Sort the notes by their creation date (descending order).
                notes.sort((a: INCCUHNote, b: INCCUHNote) => {
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
    getContactDetails(crm_contact_id: string): Observable<ContactDetailsUpdate> {
        const parameters = {
            contactid: crm_contact_id
        };

        return this.http
            .get(`${this._url}CRM/GetCitizenCommunication?${this._buildQueryString(parameters)}`, {})
            .pipe(map((data: IJSONResponse) => {
                return JSON.parse(data.response.communicationdetails) as ContactDetailsUpdate;
            }));
    }

    /**
     *
     */
    authenticate(code: string): Observable<IAuthentication> {
        return this.http
            .get(`${this._url}SSO/Authenticate?userdata=${encodeURIComponent(code)}`, {})
            .pipe(map((json: IJSONResponse) => {
                if (json.response) {
                    return <IAuthentication>json.response.UserData;
                } else if (500 === json.statusCode) {
                    return <IAuthentication>{
                        success: false,
                        message: json.value.error.message
                    };
                }
            }));
    }

    /**
     *
     */
    getLastCalls(count: number) {
        const parameters = {
            XCalls: count
        };

        return this.http
            .get(`${this._url}CRM/GetLastXCalls?${this._buildQueryString(parameters)}`, {})
            .pipe(map((data: IJSONResponse) => {
                return data[0];
            }));
    }

    /**
     * Fetches editorial text.
     */
    getEditorial(): Observable<string> {
        return this.http
            .get(`${this._url}CRM/GetEditorialDetails`, {})
            .pipe(map((data: IJSONResponse) => {
                return data.response.contents;
            }));
    }

    /**
     * Updates editorial text.
     */
    setEditorial(new_content: string) {
        const parameters = {
            content: new_content
        };

        return this.http
            .post(`${this._url}CRM/SetEditorialDetails?${this._buildQueryString(parameters)}`, {});
    }

    /**
     * TODO create a generic API service class with this method.
     */
    _buildQueryString(parameters: { [propKey: string]: any }): string {
        parameters = this.Helper.removeEmptyValues(parameters);
        const output = Object.keys(parameters).map((key) => -1 === [undefined, null].indexOf(parameters[key]) ?
            `${key}=${encodeURIComponent(parameters[key].toString())}` : null);
        return output.join('&');
    }

    /**
     * Begins processing a payment through Paris.
     */
    getPaymentURL(interaction_id: string, payment_reference: string, amount: number): Observable<string> {
        const return_data = [
            interaction_id,
            'sshetty', // username
            amount
        ];
        const return_url = `${window.location.origin}/payment.html?ReturnValue=${return_data.join('$')}`;

        const parameters = {
            returnurl: encodeURIComponent(return_url),
            payforbasketmode: true,
            returntext: encodeURIComponent('Back to NCC'),
            ignoreconfirmation: true,
            showcontactpage: 'no',
            data: encodeURIComponent('Keep this and return it at the end'),
            recordxml: `<records><record><reference>${payment_reference}</reference><fund>07</fund><amount>` + amount +
                '</amount><text></text></record></records>'
        };

        const url = `https://hackney.paris-epayments.co.uk/paymentstest/sales/launchinternet.aspx?${this._buildQueryString(parameters)}`;
        return of(url);
    }

    /**
     *
     */
    getPaymentInteractions(interaction_id: string, username: string, reference: string, status: string) {
        const parameters = {
            InteractionId: interaction_id,
            Username: username,
            Reference: reference,
            Status: status
        };

        return this.http
            .get(`${this._url}Payment/GetPaymentInteractions?${this._buildQueryString(parameters)}`, {})
            .pipe(map((data: IJSONResponse) => data.response));
    }

    /**
     *
     */
    getRentBreakdown(tenancy_reference: string) {
        const parameters = {
            tenancyAgreementId: tenancy_reference
        };

        return this.http
            .get(`${this._url}UH/GetAllRentBreakdowns?${this._buildQueryString(parameters)}`, {})
            .pipe(map((data: IRentBreakdown[]) => {
                // The descriptions are padded with spaces, so we want to trim them.
                return data.map((row: IRentBreakdown) => {
                    row.description = row.description.trim();
                    return row;
                });
            }));
    }

    /**
     *
     */
    getTenancyAgreementDetails(tenancy_reference: string): Observable<ITenancyAgreementDetails> {
        const parameters = {
            tenancyAgreementId: tenancy_reference
        };

        return this.http
            .get(`${this._url}UH/GetTenancyAgreementDetails?${this._buildQueryString(parameters)}`, {})
            .pipe(map((response) => <ITenancyAgreementDetails>response));
    }

    /**
     *
     */
    getAllTenancyTransactionStatements(
        tenancy_reference: string,
        startDate: string,
        endDate: string
    ): Observable<ITenancyTransactionRow[]> {

        // Start and end date must be in the format DD/MM/YYYY.
        // Both must be provided!
        const parameters = {
            tenancyAgreementId: tenancy_reference,
            startdate: startDate
        };
        const endDateMoment = moment(endDate, 'DD/MM/YYYY');

        return this.http
            .get(`${this._url}UH/GetAllTenancyTransactionStatements?${this._buildQueryString(parameters)}`, {})
            .pipe(map((response) => {
                // We also want the date formatted differently for sorting purposes.
                const rows = Object.values(response)
                    .filter((row) => {
                        // The endpoint doesn't restrict transactions by the end date, because it manually calculates the balance for each
                        // row. We will have to cut the results off ourselves.
                        if (endDateMoment.isValid()) {
                            const date = moment(row.date, 'DD/MM/YYYY HH:mm:ss');
                            return date.isBefore(endDateMoment);
                        }
                        return true;
                    })
                    .map((row) => {
                        const date = moment(row.date, 'DD/MM/YYYY HH:mm:ss');
                        row.date = date.format('DD/MM/YYYY HH:mm:ss');
                        row.dateSort = date.format('YYYYMMDDHHmmss');
                        return row;
                    });


                return <ITenancyTransactionRow[]>rows;
            }));

    }

    /**
     *
     */
    sendCallbackEmail(details: ICallbackNoteParameters) {
        const parameters = {
            CallBackId: details.callbackId,
            RecipientEmailId: details.recipientEmail,
            ManagerEmailId: details.managerEmail,
            PhoneNumber: details.callbackNumber,
            MessageForEmail: details.message,
            CallersFullName: details.callerName,
            HousingTagRef: details.tenancyReference,
            Address: details.address,
            AgentName: details.fromName
        };

        return this.http
            .post(`${this._url}Callback/SendCallbackEmail?${this._buildQueryString(parameters)}`, {});
    }

    /**
     *
     */
    getCallbackDetails(
        callbackID: string
    ): Observable<ICallbackDetails> {

        const parameters = {
            CallbackId: callbackID
        };

        return this.http
            .get(`${this._url}Callback/GetCallbackDetails?${this._buildQueryString(parameters)}`, {})
            .pipe(map((data: IJSONResponse) => <ICallbackDetails>data.response));

    }

    /**
     *
     */
    getUsersListFromActiveDirectory(term: string): Observable<IActiveDirectoryUserResult[]> {
        return this.http
            .get(`${this._url}Callback/GetUsersListFromActiveDirectory?username=${term}`, {})
            .pipe(map((data: IJSONResponse) => data.response.ADList));

    }

    /**
     * Fetching a list of call types from the HackneyAPI microservice, and returning them as a formatted list.
     *
     * This version of the method makes use of a [highly touted] Observable.
     */
    getCallTypes(): Observable<LogCallType[]> {
        // Fetching a list of call types from the HackneyAPI microservice, and returning them as a formatted list.
        // https://stackoverflow.com/a/50850777/4073160
        return this.http
            .get(`${this._url}CRM/CRMEnquiryCallTypes`)
            .pipe(
                map((response: IJSONResponse) => {
                    // https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_map
                    // Though the above recommends using lodash/underscore for mapping with an object, we can still do it using native JS.
                    const types = response.result;

                    // Prepare the data returned from the microservice as a list (array) of ID and label pairs.
                    const indexed_types: Array<LogCallType> = Object.keys(types).map(
                        // (value, index) => new LogCallType(index, types[index])
                        (value, index) => {
                            const id = parseInt(value, 10);
                            return new LogCallType(id, types[id]);
                        });

                    return indexed_types;
                })
            );
    }

        /**
     * Fetching a list of call reasons from the HackneyAPI microservice, and returning them as a formatted list.
     *
     * This method uses an Observable.
     */
    getCallReasons(): Observable<any> {
        //
        // https://stackoverflow.com/a/50850777/4073160
        return this.http
            .get(`${this._url}CRM/CRMEnquirySubTypes`)
            .pipe(
                map((response: IJSONResponse) => {
                    let groups: { [propKey: number]: any }; // groups of call reasons, indexed by call type.
                    const types = response.results;

                    groups = {};
                    Object.keys(types)
                        .map(function(key) {
                            const call_type = parseInt(types[key].enquiryCallType, 10);
                            const reason: LogCallReason = new LogCallReason(types[key].enquiryTypeId, types[key].enquiryType);
                            if (undefined === groups[call_type]) {
                                groups[call_type] = [];
                            }
                            groups[call_type].push(reason);
                        });
                    return groups;
                })
            );
    }

}
