import { Caller } from '../interfaces/caller.interface';
import { ContactAddress } from '../classes/contact-address.class';

/**
 * This class represents an anonymous caller, as selected from the Identify page.
 */
export class AnonymousCaller implements Caller {

    isAnonymous(): boolean {
        return true;
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

}
