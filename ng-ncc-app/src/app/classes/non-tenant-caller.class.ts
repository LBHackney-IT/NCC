import { AnonymousCaller } from '../classes/anonymous-caller.class';

/**
 * This class represents an anonymous caller, as selected from the Identify page.
 */
export class NonTenantCaller extends AnonymousCaller {

    private _crm_contact_id: string;

    constructor(crm_contact_id: string) {
        super();
        this._crm_contact_id = crm_contact_id;
    }

    getName(): string {
        return 'Non-tenant';
    }

    /**
     * Returns the caller's CRM contact ID.
     */
    getContactID(): string {
        return this._crm_contact_id;
    }

}
