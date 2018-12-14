import { Caller } from '../classes/caller.class';
import { ICitizenIndexSearchResult } from '../interfaces/citizen-index-search-result';
import { ContactAddress } from '../classes/contact-address.class';
import * as moment from 'moment';

/**
 * This class represents an identified caller, as selected from the Identify page.
 */
export class IdentifiedCaller extends Caller {

    error: boolean; // for the benefit of the identify tenant page.

    constructor(private _details: ICitizenIndexSearchResult) {
        super();
    }

    isAnonymous(): boolean {
        return false;
    }

    isNonTenant(): boolean {
        return false;
    }

    /**
     * Returns the caller's full name.
     */
    getName(): string {
        return this._details.fullName;
    }

    /**
     * Returns the caller's first name.
     */
    getFirstName(): string {
        return this._details.firstName;
    }

    /**
     * Returns the caller's last name.
     */
    getLastName(): string {
        return this._details.surname;
    }

    /**
     * Returns the caller's title.
     */
    getTitle(): string {
        return this._details.title;
    }

    /**
     * Returns the caller's telephone numbers.
     */
    getTelephoneNumbers(): string[] {
        // We take each of the available telphone number slots and filter out empty ones.
        // (e.g. a caller might have telephone1 and telephone3, but not telephone2.)
        return [
            this._details.telephone1,
            this._details.telephone2,
            this._details.telephone3
        ].filter((n) => null !== n);
    }

    /**
     * Returns the caller's email address[es].
     */
    getEmailAddresses(): string[] {
        return [this._details.emailAddress].filter((n) => null !== n);
    }

    getDateOfBirth(): string | null {
        if (this._details.dateOfBirth) {
            const date = moment(this._details.dateOfBirth, 'YYYY-MM-DD');
            return date.format('DD/MM/YYYY');
        }
        return null;
    }

    /**
     * Returns the caller's postal address.
     */
    getPostalAddress(): ContactAddress {
        return {
            line_1: this._details.addressLine1,
            line_2: this._details.addressLine2,
            town: this._details.addressLine3,
            county: this._details.addressCity,
            postcode: this._details.postCode,
        } as ContactAddress;
    }

    /**
     * Returns the caller's postal address as HTML.
     */
    getPostalAddressHTML(): string {
        return [
            this._details.addressLine1,
            this._details.addressLine2,
            this._details.addressLine3,
            this._details.addressCity,
            this._details.postCode
        ].join('<br>');
    }

    /**
     * Returns the caller's CRM contact ID.
     */
    getContactID(): string | null {
        return this._details.crmContactId;
    }

    /**
     * Returns the the CRM contact ID to use for recording notes.
     */
    getContactIDForNotes(): string | null {
        return this._details.crmContactId;
    }

}
