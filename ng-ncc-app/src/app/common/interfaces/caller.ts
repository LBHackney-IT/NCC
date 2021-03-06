/**
 * This ICaller interface allows us to define both identified and anonymous callers.
 */

import { ContactAddress } from '../classes/contact-address.class';

export interface ICaller {
    tenancy_reference?: string | null; // for the benefit of NonTenantCaller.
    isAnonymous(): boolean;
    isNonTenant(): boolean;
    getName(): string;
    getTelephoneNumbers(): string[];
    getContactID(): string | null;
    getEmailAddresses(): string[];
    getPostalAddress(): ContactAddress;
    hasNoTelephoneNumbers(): boolean;
    hasNoEmailAddresses(): boolean;
}
