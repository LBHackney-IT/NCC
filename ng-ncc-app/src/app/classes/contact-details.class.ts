import { ContactAddress } from './contact-address.class';

export class ContactDetails {
    email: string;
    letter: ContactAddress;
    sms: string;

    constructor() {
        this.letter = new ContactAddress;
    }
}
