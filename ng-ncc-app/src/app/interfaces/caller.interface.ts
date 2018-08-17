/**
 * This Caller interface allows us to define both identified and anonymous callers.
 */
export interface Caller {
    isAnonymous(): boolean;
    getName(): string;
    getTelephoneNumbers(): string[];
    getEmailAddresses(): string[];
}
