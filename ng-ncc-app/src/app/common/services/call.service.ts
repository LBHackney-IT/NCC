import { Injectable } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { Observable, forkJoin, of, ReplaySubject, from } from 'rxjs';

import { CALL_REASON } from '../constants/call-reason.constant';
import { ICaller } from '../../common/interfaces/caller';
import { IJSONResponse } from '../../common/interfaces/json-response';
import { ILogCallSelection } from '../../common/interfaces/log-call-selection';
import { INCCNote } from '../../common/interfaces/ncc-note';
import { NCCAPIService } from '../../common/API/NCCAPI/ncc-api.service';
import { ManageATenancyAPIService } from '../../common/API/ManageATenancyAPI/manageatenancy-api.service';
import { AccountService } from '../services/account.service';
import { AnonymousCaller } from '../../common/classes/anonymous-caller.class';
import { IdentifiedCaller } from '../../common/classes/identified-caller.class';
import { NonTenantCaller } from '../../common/classes/non-tenant-caller.class';
import { ICRMServiceRequest } from '../../common/interfaces/crmservicerequest';
import { IAddressSearchGroupedResult } from '../../common/interfaces/address-search-grouped-result';
import { IAccountDetails } from '../../common/interfaces/account-details';
import { IPaymentInteraction } from '../../common/interfaces/payment-interaction';
import { AuthService } from '../services/auth.service';
import { LogCallType } from '../../common/classes/log-call-type.class';
import { LogCallReason } from '../../common/classes/log-call-reason.class';
import { NotesService } from '../services/notes.service';
import { ViewOnlyService } from '../services/view-only.service';

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
        private Account: AccountService,
        private Auth: AuthService,
        private ManageATenancyAPI: ManageATenancyAPIService,
        private NCCAPI: NCCAPIService,
        private Notes: NotesService,
        private ViewOnly: ViewOnlyService
    ) {
        this.reset();
    }

    /**
     * Returns TRUE if we are currently on a call, determined by the presence of a call ID.
     */
    isActive(): boolean {
        return null !== this.call_id;
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
        this._createNewCall();
    }

    /**
     * Attempts to create a new call, based on set information.
     * At the very least a caller is required to have been set.
     */
    private _createNewCall() {
        if (this.caller) {
            if ((this.caller.isNonTenant() || !this.caller.isAnonymous()) && !this.tenancy) {
                return;
            }
            const contact_id = this.caller.getContactID();

            if (this.ViewOnly.status) {
                // console.log('View only status; do not create a call.');
                this.call_id = 'debug';
                this.ticket_number = 'debug';

                // Fetch the account details.
                this.Account.getFor(this.caller, this.tenancy)
                    .pipe(take(1))
                    .subscribe((account) => {
                        this._setAccountDetails(account);
                    });
                return;
            }

            // We're subscribing to two API endpoints, so we can use forkJoin here to ensure that both are successful.
            // If either one fails we will get an error.
            forkJoin(
                // Create a call to record notes against.
                this.NCCAPI.createCall(contact_id),

                // We also fetch account details, in order to obtain the associated tenancy reference, via the Manage A Tenancy API.
                this.Account.getFor(this.caller, this.tenancy)
            )
                .pipe(take(1))
                .pipe(
                    map(data => {
                        // This simply gives us named references to the Observable results.
                        return { call: <ICRMServiceRequest>data[0], account: data[1] };
                    })
                )
                .subscribe(
                    (response) => {
                        this.call_id = response.call.id;
                        this.ticket_number = response.call.ticketNumber;
                        // console.log(`Call ${this.call_id} was created (ticket #${this.ticket_number}).`);

                        // Handle the tenant's account data.
                        this._setAccountDetails(response.account);

                        // Enable the add note form.
                        const tenancy_reference = this.caller.isNonTenant() ?
                            this.caller.tenancy_reference : this.account.tagReferenceNumber;
                        const settings = {
                            agent_name: this.Auth.getFullName(),
                            agent_crm_id: this.Auth.getUserID(),
                            call_id: this.call_id,
                            ticket_number: this.ticket_number,
                            call_reason_id: null, // TODO this.call_nature.call_reason.id,
                            other_reason: null, // TODO this.call_nature.other_reason,
                            existing_repair_contractor_reason: null, // TODO this.call_nature.existing_repair_contractor_reason,
                            crm_contact_id: this.caller.getContactID(),
                            tenancy_reference: tenancy_reference
                        };
                        this.Notes.enable(this.caller.getName(), settings);
                    });
        }
    }

    /**
     *
     */
    private _setAccountDetails(account: IAccountDetails) {
        this.account = account;
        this.accountSubject.next(this.account);
        // Anything subscribed to getAccountDetails() will receive updated account information.
        // console.log(`Account details were obtained.`, this.account.tagReferenceNumber);
    }

    /**
     * Returns the tenancy reference number associated with the caller.
     */
    getTenancyReference(): string {
        return this.account ? this.account.tagReferenceNumber : null;
    }

    /**
     * Returns the property reference number associated with the caller.
     */
    getPropertyReferenceNumber(): string {
        return this.account ? this.account.propertyReferenceNumber : null;
    }

    /**
     * Returns the property reference number associated with the caller.
     */
    getAccountId(): string {
        return this.account ? this.account.accountid : null;
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
    getAccount() {
        if (this.account) {
            // Handling an unusual problem on the statement page, where the accountSubject returns null.
            return of(this.account);
        }
        return this.accountSubject;
    }

    private _getCallNatureAsText(): string {
        const call_type = this.call_nature.call_type.label;
        const call_reason = this.call_nature.other_reason ? `Other (${this.call_nature.other_reason})` :
            this.call_nature.existing_repair_contractor_reason ? `${CALL_REASON.EXISTING_REPAIR_CONTRACTOR} (${this.call_nature.existing_repair_contractor_reason})` :
            this.call_nature.call_reason.label;
        return `${call_type} - ${call_reason}`;
    }

    /**
     * Sets the nature (type and reason) of the call.
     */
    setCallNature(selection: ILogCallSelection) {
        this.call_nature = selection;

        let observe$: Observable<any>;

        if (this.call_id) {
            // If we're currently in a call, record a note mentioning the additional call reason.
            // Wait for the note to be recorded before creating a new call.
            observe$ = this.recordAutomaticNote(`Additional call reason: ${this._getCallNatureAsText()}`);
        } else {
            observe$ = of([]);
        }

        // Attempt to create a new call.
        // We create a new call to set the [new] call type and reason.
        observe$.pipe(take(1))
            .subscribe(() => {
                this._createNewCall();
            });
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
        this._createNewCall();
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

        this.accountSubject.next(null);
        this.Notes.disable();
    }

    /**
     * Record a manual note against the call.
     */
    recordManualNote(note_content: string): Observable<any> {
        return this.Notes.recordManualNote(this.call_nature, note_content);
    }

    /**
     * Record an automatic note against the call.
     */
    recordAutomaticNote(note_content: string): Observable<any> {
        return this.Notes.recordAutomaticNote(note_content);
        // This allows us to retrieve the Observables results just once.
    }

    /**
     * Record an automatic comms note against the call.
     */
    recordCommsNote(notify_template_name: string, notify_method: string): Observable<any> {
        return this.Notes.recordCommsNote(notify_template_name, notify_method);
    }

    /**
     *
     */
    private _formatNoteContent(note_content: string): string {
        if (CALL_REASON.OTHER === this.call_nature.call_reason.id) {
            note_content = `Other: ${this.call_nature.other_reason}\n${note_content}`;
        } else if (this.call_nature.call_reason.label === CALL_REASON.EXISTING_REPAIR_CONTRACTOR) {
            note_content = `${this.call_nature.existing_repair_contractor_reason}\n${note_content}`
        }

        return note_content;
    }

}
