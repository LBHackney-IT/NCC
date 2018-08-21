import { Caller } from '../interfaces/caller.interface';
import { CitizenIndexSearchResult } from '../interfaces/citizen-index-search-result.interface';
import { ContactAddress } from '../classes/contact-address.class';

/**
 * This class represents an identified caller, as selected from the Identify page.
 */
export class IdentifiedCaller implements Caller {

    _details: CitizenIndexSearchResult;

    constructor(citizen: CitizenIndexSearchResult) {
        this._details = citizen;
    }

    isAnonymous(): boolean {
        return false;
    }

    /**
     * Returns the caller's full name.
     */
    getName(): string {
        return this._details.fullName;
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

    /**
     * Returns the caller's postal address.
     */
    getPostalAddress(): ContactAddress {
        let address = new ContactAddress;
        address.line_1 = this._details.addressLine1;
        address.line_2 = this._details.addressLine2;
        address.town = this._details.addressLine3;
        address.county = this._details.addressCity;
        address.postcode = this._details.postCode;

        return address;
    }

}
