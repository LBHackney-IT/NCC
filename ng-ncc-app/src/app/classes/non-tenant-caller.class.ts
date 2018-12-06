import { environment } from '../../environments/environment';

import { AnonymousCaller } from '../classes/anonymous-caller.class';

/**
 * This class represents an anonymous caller, as selected from the Identify page.
 */
export class NonTenantCaller extends AnonymousCaller {

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
