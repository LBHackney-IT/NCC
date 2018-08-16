import { Caller } from '../interfaces/caller.interface';
import { CitizenIndexSearchResult } from '../interfaces/citizen-index-search-result.interface';

/**
 * This class represents an identified caller, as selected from the Identify page.
 */
export class IdentifiedCaller implements Caller {

    _details: CitizenIndexSearchResult;

    constructor(citizen: CitizenIndexSearchResult) {
        this._details = citizen;
        console.log('New identified caller', this.getName());
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
        return [
            this._details.telephone1,
            this._details.telephone2,
            this._details.telephone3
        ].filter(this._filterEmpty);
    }

    /**
     * Returns the caller's email addresses.
     */
    getEmailAddresses(): string[] {
        return [this._details.emailAddress].filter(this._filterEmpty);
    }

    /**
     * TODO this is a common method.
     */
    _filterEmpty(n: any) {
        return n != undefined;
    }

}
