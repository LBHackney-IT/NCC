import { ContactDetails } from './contact-details.class';
import { CommsOption } from './comms-option.class';
import { CONTACT } from '../constants/contact.constant';

export class CommsSelection {
    form: CommsOption;
    method: string;
    existing: ContactDetails;
    create: ContactDetails;

    constructor() {
        this.form = null;
        this.method = null;
        this.existing = new ContactDetails;
        this.create = new ContactDetails;
    }

    /**
     * Returns true if this comm[unication]s selection is "complete".
     * (i.e. if we have a form, a method of communication selected and the relevant details.)
     */
    isComplete(): boolean {
        return !(null === this.form || null === this.method) && this.hasDetail();
    }

    /**
     * Returns the selected details corresponding to the selected method.
     */
    getDetail() {
        switch (this.method) {
            case CONTACT.METHOD_POST:
                return this.existing.letter.toString();
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
