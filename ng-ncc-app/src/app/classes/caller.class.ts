// This class implements the ICaller interface, and exists to provide default methods for each of the caller types.

import { ICaller } from '../interfaces/caller';
import { ContactAddress } from '../classes/contact-address.class';

export abstract class Caller implements ICaller {

    /**
     *
     */
    isAnonymous(): boolean {
        return true;
    }

    /**
     * Returns the caller's CRM contact ID.
     */
    getContactID(): string {
        return null;
    }

    /**
     *
     */
    getName(): string {
        return null;
        // TODO would an anonymous caller be able to provide a name?
    }

    /**
     *
     */
    getTelephoneNumbers(): string[] {
        return [];
    }

    /**
     *
     */
    getEmailAddresses(): string[] {
        return [];
    }

    /**
     *
     */
    getPostalAddress(): ContactAddress {
        return null;
    }

    /**
     * Returns TRUE if the caller has no email address[es].
     */
    hasNoEmailAddresses(): boolean {
        return 0 === this.getEmailAddresses().length;
    }

    /**
     * Returns TRUE if the caller has no telephone numbers.
     */
    hasNoTelephoneNumbers(): boolean {
        return 0 === this.getTelephoneNumbers().length;
    }

}
