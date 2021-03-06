import { environment } from '../../../environments/environment';

import { AnonymousCaller } from '../classes/anonymous-caller.class';

/**
 * This class represents a non-tenant caller, as selected from the Identify page.
 * Non-tenant callers are able to make payments toward a tenancy account, but cannot access sensitive information.
 */
export class NonTenantCaller extends AnonymousCaller {

    constructor(public tenancy_reference: string) {
        super();
    }

    isNonTenant(): boolean {
        return true;
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

}
