import { ContactAddress } from './contact-address.class';

export class IContactDetails {
    email: string;
    letter: ContactAddress;
    sms: string;

    constructor() {
        this.letter = new ContactAddress;
    }
}
