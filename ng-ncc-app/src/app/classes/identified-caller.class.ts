import { Caller } from '../interfaces/caller.interface';
import { CitizenIndexSearchResult } from '../interfaces/citizen-index-search-result.interface';

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

}
