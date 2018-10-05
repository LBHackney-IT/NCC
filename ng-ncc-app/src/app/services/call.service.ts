import { Injectable } from '@angular/core';
import { Caller } from '../interfaces/caller.interface';
import { LogCallSelection } from '../interfaces/log-call-selection.interface';
import { NCCAPIService } from '../API/NCCAPI/ncc-api.service';
import { ManageATenancyAPIService } from '../API/ManageATenancyAPI/manageatenancy-api.service';
import { IdentifiedCaller } from '../classes/identified-caller.class';
import { CRMServiceRequest } from '../interfaces/crmservicerequest.interface';
import { AddressSearchGroupedResult } from '../interfaces/address-search-grouped-result.interface';
import { AccountDetails } from '../interfaces/account-details.interface';

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
    // - account details associated with the caller;
    // - notes relating to the call.

    private account: AccountDetails;
    private caller: Caller;
    private call_nature: LogCallSelection;
    private call_id: string;
    private tenancy: AddressSearchGroupedResult;
    private tenants: { [propKey: string]: string }[];
    private ticket_number: string;

    constructor(private ManageATenancyAPI: ManageATenancyAPIService, private NCCAPI: NCCAPIService) {
        this.reset();
    }

    /**
     * Returns TRUE if a caller has been defined.
     */
    hasCaller(): boolean {
        return (undefined !== this.caller && null !== this.caller);
    }

    isCallerIdentified(): boolean {
        return this.hasCaller() && !this.caller.isAnonymous();
    }

    /**
     * Returns TRUE if a caller has been defined.
     */
    hasCallNature(): boolean {
        return !!(this.call_nature);
    }

    /**
     *
     */
    getCallID(): string {
        return this.call_id;
    }

    /**
     * Returns the caller associated with the call.
     */
    getCaller(): Caller {
        return this.caller;
    }

    /**
     * Returns the call type and reason (as their respective IDs).
     */
    getCallNature(): LogCallSelection {
        return this.call_nature;
    }

    /**
     * Sets the caller for this call.
     */
    setCaller(caller: Caller) {
        this.caller = caller;
        console.log('Caller has been set to:', this.caller.getName());
        console.log(`The caller ${caller.isAnonymous() ? 'is' : 'is not'} anonymous.`);

        const contact_id = caller.getContactID();
        if (contact_id) {
            // Create a call to record notes against.
            this.NCCAPI.createCall(contact_id)
                .subscribe((data: CRMServiceRequest) => {
                    this.call_id = data.id;
                    this.ticket_number = data.ticketNumber;
                    console.log(`Call ${data.id} was created.`);
                });

            // We can also obtain the associated tenancy reference via the Manage A Tenancy API.
            // The tenancy reference is required to record Action Diary entries.
            this.ManageATenancyAPI.getAccountDetails(contact_id)
                .subscribe((data: AccountDetails) => {
                    this.account = data;
                    console.log(`Account details were obtained.`);
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
     * Returns the account details associated with the caller.
     */
    getAccount(): AccountDetails {
        return this.account;
    }

    /**
     * Sets the nature (type and reason) of the call.
     */
    setCallNature(selection: LogCallSelection) {
        this.call_nature = selection;
    }

    /**
     *
     */
    getTenancy(): AddressSearchGroupedResult {
        return this.tenancy;
    }

    /**
     *
     */
    setTenancy(tenancy: AddressSearchGroupedResult) {
        this.tenancy = tenancy;
        this._buildTenantsList();
    }

    _buildTenantsList() {
        this.tenants = this.tenancy.results.map((row) => {
            return {
                contact_id: row.crmContactId,
                full_name: row.fullName
            };
        });
    }

    getTenants() {
        return this.tenants;
    }

    /**
     * Reset the call to a new state.
     */
    reset() {
        this.caller = null;
        this.call_nature = null;
        this.call_id = null;
        this.ticket_number = null;
        this.tenancy = null;
        console.log('Call was reset.');
    }

    /**
     * Record a note against the call.
     */
    recordNote(note_content: string, automatic: boolean = false) {
        return this.NCCAPI.createNote(
            this.call_id,
            this.ticket_number,
            this.call_nature.call_reason.id,
            this.caller.getContactID(),
            note_content,
            automatic
        );
    }

    /**
     * Record an Action Diary entry against the tenancy associated with the call (if present).
     */
    recordActionDiaryNote(note_content: string) {
        const tenancy_reference = this.getTenancyReference();
        if (tenancy_reference) {
            return this.NCCAPI.createActionDiaryEntry(tenancy_reference, note_content).subscribe();
        }
    }

}
