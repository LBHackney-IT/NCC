import { Injectable } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { Observable, forkJoin, of, ReplaySubject, from } from 'rxjs';

import { CALL_REASON } from '../constants/call-reason.constant';
import { ICaller } from '../interfaces/caller';
import { IJSONResponse } from '../interfaces/json-response';
import { ILogCallSelection } from '../interfaces/log-call-selection';
import { INCCNote } from '../interfaces/ncc-note';
import { NCCAPIService } from '../API/NCCAPI/ncc-api.service';
import { HackneyAPIService } from '../API/HackneyAPI/hackney-api.service';
import { ManageATenancyAPIService } from '../API/ManageATenancyAPI/manageatenancy-api.service';
import { IdentifiedCaller } from '../classes/identified-caller.class';
import { NonTenantCaller } from '../classes/non-tenant-caller.class';
import { ICRMServiceRequest } from '../interfaces/crmservicerequest';
import { IAddressSearchGroupedResult } from '../interfaces/address-search-grouped-result';
import { IAccountDetails } from '../interfaces/account-details';
import { IPaymentInteraction } from '../interfaces/payment-interaction';
import { AuthService } from '../services/auth.service';
import { LogCallType } from '../classes/log-call-type.class';
import { LogCallReason } from '../classes/log-call-reason.class';
import { NotesService } from '../services/notes.service';

@Injectable({
    providedIn: 'root'
})
export class CallService {

    // This service manages the current call.
    // It contains the following:
    // - a caller (who could be identified or anonymous);
    // - a call type;
    // - a call reason;
    // - a list of tenants at the property;
    // - account details associated with the caller.

    private account: IAccountDetails;
    private accountSubject = new ReplaySubject<IAccountDetails>();
    private caller: ICaller;
    private call_nature: ILogCallSelection;
    private call_id: string;
    private interaction_id: string;
    private tenancy: IAddressSearchGroupedResult;
    private tenants: { [propKey: string]: string }[];
    private ticket_number: string;

    constructor(
        private Auth: AuthService,
        private HackneyAPI: HackneyAPIService,
        private ManageATenancyAPI: ManageATenancyAPIService,
        private NCCAPI: NCCAPIService,
        private Notes: NotesService
    ) {
        this.reset();
    }

    /**
     * Returns TRUE if a caller has been defined.
     */
    hasCaller(): boolean {
        return (undefined !== this.caller && null !== this.caller);
    }

    /**
     * Returns TRUE if the call has an identified caller.
     */
    isCallerIdentified(): boolean {
        return this.hasCaller() && !this.caller.isAnonymous();
    }

    /**
     * Returns TRUE if the caller is a "non-tenant" caller.
     */
    isCallerNonTenant(): boolean {
        return this.hasCaller() && this.caller.isAnonymous() && (this.caller instanceof NonTenantCaller);
    }

    /**
     * Returns TRUE if a caller has been defined.
     */
    hasCallNature(): boolean {
        return !!(this.call_nature);
    }

    /**
     * Returns this call's ID.
     */
    getCallID(): string {
        return this.call_id;
    }

    /**
     * Returns the caller associated with the call.
     */
    getCaller(): ICaller {
        return this.caller;
    }

    /**
     * Returns the call type and reason (as their respective IDs).
     */
    getCallNature(): ILogCallSelection {
        return this.call_nature;
    }

    /**
     * Returns the ticket number associated with the call.
     */
    getTicketNumber(): string {
        return this.ticket_number;
    }

    /**
     * Sets the caller for this call.
     */
    setCaller(caller: ICaller) {
        this.caller = caller;
        // console.log('Caller has been set to:', this.caller.getName());
        // console.log(`The caller ${caller.isAnonymous() ? 'is' : 'is not'} anonymous.`);

        const contact_id = caller.getContactID();
        if (contact_id) {

            // We're subscribing to two API endpoints, so we can use forkJoin here to ensure that both are successful.
            // If either one fails we will get an error.
            const subscription = forkJoin(
                // Create a call to record notes against.
                this.NCCAPI.createCall(contact_id),

                // We can also obtain the associated tenancy reference via the Manage A Tenancy API.
                // The tenancy reference is required to record Action Diary entries.
                this.ManageATenancyAPI.getAccountDetails(contact_id)
            )
                .pipe(
                    map(data => {
                        return { call: <ICRMServiceRequest>data[0], account: data[1] };
                    })
                )
                .subscribe(
                    (response) => {
                        // Deal with the created call.
                        this.call_id = response.call.id;
                        this.ticket_number = response.call.ticketNumber;
                        // console.log(`Call ${this.call_id} was created (ticket #${this.ticket_number}).`);

                        // Handle the tenant's account data.
                        this.account = response.account;
                        this.accountSubject.next(response.account);
                        console.log(`Account details were obtained.`);

                        // Create an automatic note mentioning the selected caller.
                        this.createCallerNote();

                        // Enable the add note form.
                        const settings = {
                            call_id: this.call_id,
                            ticket_number: this.ticket_number,
                            call_reason_id: this.call_nature.call_reason.id,
                            other_reason: this.call_nature.other_reason,
                            crm_contact_id: this.caller.getContactID(),
                            tenancy_reference: this.account.tagReferenceNumber
                        };
                        this.Notes.enable(this.caller.getName(), settings);
                    },
                    (error) => {
                        console.error(error);
                    },
                    () => {
                        subscription.unsubscribe();
                    });
        }
    }

    /**
     * Creates an automatic note about the caller being identified.
     */
    createCallerNote() {
        if (this.call_id) {
            const name = this.caller.isAnonymous() ? 'anonymous' : this.caller.getName();

            this.recordAutomaticNote(`Caller identified as ${name}.`)
                .pipe(take(1))
                .subscribe((data: INCCNote) => {
                    // Store the interaction ID from this note for later use (i.e. when and if making a payment.)
                    // Making a payment via Paris requires an interaction ID, and since we're creating this note we can obtain one from it.
                    this.interaction_id = data.interactionId;
                    console.log('Interaction ID is', this.interaction_id);

                    // Record an Action Diary note about the call type and reason.
                    const call_type = this.call_nature.call_type.label;
                    const call_reason = this.call_nature.other_reason ? `Other (${this.call_nature.other_reason})` :
                        this.call_nature.call_reason.label;
                    this.recordActionDiaryNote(`calling about ${call_type} - ${call_reason}.`)
                });
        }
    }

    /**
     * Returns the tenancy reference number associated with the caller.
     */
    getTenancyReference(): string {
        return this.account ? this.account.tagReferenceNumber : null;
    }

    /**
     * Returns the payment reference number associated with the caller.
     */
    getPaymentReference(): string {
        return this.account ? this.account.paymentReferenceNumber : null;
    }

    /**
     * Returns the account details associated with the caller.
     */
    getAccount(): ReplaySubject<IAccountDetails> {
        return this.accountSubject;
    }

    /**
     * Sets the nature (type and reason) of the call.
     */
    setCallNature(selection: ILogCallSelection) {
        this.call_nature = selection;
        if (this.call_id) {
            this.recordAutomaticNote(`Additional call reason.`).subscribe();
        }
    }

    /**
     *
     */
    getTenancy(): IAddressSearchGroupedResult {
        return this.tenancy;
    }

    /**
     *
     */
    setTenancy(tenancy: IAddressSearchGroupedResult) {
        this.tenancy = tenancy;
        this._buildTenantsList();
    }

    /**
     *
     */
    hasTenancy(): boolean {
        return null !== this.tenancy;
    }

    /**
     *
     */
    _buildTenantsList() {
        this.tenants = this.tenancy.results.map((row) => {
            return {
                contact_id: row.crmContactId,
                full_name: row.fullName
            };
        });
    }

    /**
     *
     */
    getTenants() {
        return this.tenants;
    }

    /**
     *
     */
    getInteractionID(): string {
        return this.interaction_id;
    }

    /**
     * Reset the call to a new state.
     */
    reset() {
        this.account = null;
        this.caller = null;
        this.call_nature = null;
        this.call_id = null;
        this.interaction_id = null;
        this.tenancy = null;
        this.tenants = null;
        this.ticket_number = null;

        this.Notes.disable();
        // console.log('Call was reset.');
    }

    /**
     * Record a manual note against the call.
     */
    recordManualNote(note_content: string): Observable<any> {
        // If the call reason is "Other", prepend the note with the specfied reason text.
        note_content = this._formatNoteContent(note_content);

        return forkJoin(

            // Manual note...
            this.NCCAPI.createManualNote(
                this.call_id,
                this.ticket_number,
                this.call_nature.call_reason.id,
                this.caller.getContactID(),
                note_content
            ),

            // Action Diary note...
            this.recordActionDiaryNote(note_content)
        )
            .pipe(take(1))
            .pipe(map((data: IJSONResponse[]) => data[0].response.NCCInteraction));
        // This allows us to retrieve the Observables results just once.
    }

    /**
     * Record an automatic note against the call.
     */
    recordAutomaticNote(note_content: string): Observable<any> {
        note_content = this._formatNoteContent(note_content);

        return forkJoin(

            // Automatic note...
            this.NCCAPI.createAutomaticNote(
                this.call_id,
                this.ticket_number,
                this.getTenancyReference(),
                this.call_nature.call_reason.id,
                this.caller.getContactID(),
                note_content
            ),

            // Action Diary note...
            this.recordActionDiaryNote(note_content)

        )
            .pipe(take(1))
            .pipe(map((data: IJSONResponse[]) => data[0].response.NCCInteraction));
        // This allows us to retrieve the Observables results just once.
    }

    /**
     * Record an automatic comms note against the call.
     */
    recordCommsNote(notify_template_name: string, notify_method: string) {
        const note_content = `${notify_template_name} comms sent by ${notify_method}.`;

        return forkJoin(

            // Automatic note...
            this.NCCAPI.createAutomaticNote(
                this.call_id,
                this.ticket_number,
                this.getTenancyReference(),
                this.call_nature.call_reason.id,
                this.caller.getContactID(),
                note_content,
                { GovNotifyTemplateType: notify_template_name, GovNotifyChannelType: notify_method }
            ),

            // Action Diary note...
            this.recordActionDiaryNote(note_content)
        ).pipe(take(1)).subscribe();
        // This allows us to retrieve the Observables results just once.
    }

    /**
     * Record an Action Diary entry against the tenancy associated with the call (if present).
     */
    recordActionDiaryNote(note_content: string) {
        const tenancy_reference = this.getTenancyReference();
        console.log('do we have a tenancy reference?', tenancy_reference);
        if (tenancy_reference) {
            // Add the caller's name to the note content (as caller information isn't saved with Action Diary notes).
            const note = `${this.caller.getName()}: ${note_content}`;
            return this.NCCAPI.createActionDiaryEntry(tenancy_reference, note);
        }

        return of(true);
    }

    /**
     *
     */
    private _formatNoteContent(note_content: string): string {
        if (CALL_REASON.OTHER === this.call_nature.call_reason.id) {
            note_content = `Other: ${this.call_nature.other_reason}\n${note_content}`;
        }

        return note_content;
    }

}
