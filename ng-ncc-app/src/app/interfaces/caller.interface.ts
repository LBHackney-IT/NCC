/**
 * This Caller interface allows us to define both identified and anonymous callers.
 */

import { ContactAddress } from '../classes/contact-address.class';

export interface Caller {
    isAnonymous(): boolean;
    getName(): string;
    getTelephoneNumbers(): string[];
    getContactID(): string | null;
    getEmailAddresses(): string[];
    getPostalAddress(): ContactAddress;
    hasNoTelephoneNumbers(): boolean;
    hasNoEmailAddresses(): boolean;
}
