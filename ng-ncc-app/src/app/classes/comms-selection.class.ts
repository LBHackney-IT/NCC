import { ContactDetails } from './contact-details.class';
import { CONTACT } from '../constants/contact.constant';

export class CommsSelection {
    method: string;
    existing: ContactDetails;
    create: ContactDetails;

    constructor() {
        this.method = null;
        this.existing = new ContactDetails;
        this.create = new ContactDetails;
    }

    /**
     * Returns true if this comm[unication]s selection is "complete".
     * (i.e. if we have a method of communication selected and the relevant details.)
     */
    isComplete(): boolean {
        return (null !== this.method) && this.hasDetail();
    }

    /**
     * Returns the selected details corresponding to the selected method.
     */
    getDetail() {
        switch (this.method) {
            case CONTACT.METHOD_POST:
                return this.existing[CONTACT.METHOD_POST];
            default:
                return this.existing[this.method] ? this.existing[this.method] : this.create[this.method];
        }
    }

    /**
     * Returns TRUE if details for the selected method are present.
     */
    hasDetail() {
        switch (this.method) {
            case CONTACT.METHOD_POST:
                return this.existing.letter.isValid();
            default:
                return this.existing[this.method] || this.create[this.method];
        }
    }
}
