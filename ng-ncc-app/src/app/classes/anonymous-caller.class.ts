import { environment } from '../../environments/environment';

import { ICaller } from '../interfaces/caller';
import { ContactAddress } from '../classes/contact-address.class';

/**
 * This class represents an anonymous caller, as selected from the Identify page.
 */
export class AnonymousCaller implements ICaller {

    isAnonymous(): boolean {
        return true;
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

    getTelephoneNumbers(): string[] {
        return [];
    }

    getEmailAddresses(): string[] {
        return [];
    }

    getPostalAddress(): ContactAddress {
        return null;
    }

    hasNoEmailAddresses(): boolean {
        return true;
    }

    hasNoTelephoneNumbers(): boolean {
        return true;
    }
}
