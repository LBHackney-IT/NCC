import { environment } from '../../../environments/environment';

import { Caller } from '../classes/caller.class';
import { ContactAddress } from '../classes/contact-address.class';

/**
 * This class represents an anonymous caller, as selected from the Identify page.
 */
export class AnonymousCaller extends Caller {

    isAnonymous(): boolean {
        return true;
    }

    isNonTenant(): boolean {
        return false;
    }

    /**
     * Returns the caller's CRM contact ID.
     */
    getContactID(): string {
        return environment.anonymousUserID;
    }

    /**
     * Returns the the CRM contact ID to use for recording notes.
     */
    getContactIDForNotes(): string {
        return environment.anonymousUserID;
    }

    getName(): string {
        return null;
        // TODO would an anonymous caller be able to provide a name?
    }

}
