import { environment } from '../../environments/environment';

import { AnonymousCaller } from '../classes/anonymous-caller.class';

/**
 * This class represents a non-tenant caller, as selected from the Identify page.
 * Non-tenant callers are able to make payments toward a tenancy account, but cannot access sensitive information.
 */
export class NonTenantCaller extends AnonymousCaller {

    constructor(public tenancy_reference: string) {
        super();
    }

    getName(): string {
        return 'Non-tenant';
    }

    /**
     * Returns the caller's CRM contact ID.
     */
    getContactID(): string | null {
        return environment.nonTenantUserID;
    }

    /**
     * Returns the the CRM contact ID to use for recording notes.
     */
    getContactIDForNotes(): string | null {
        return environment.nonTenantUserID;
    }

}
