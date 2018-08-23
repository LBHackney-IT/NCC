/**
 * This interface is used for managing the update of a caller's contact details.
 */
export class ContactDetailsUpdate {
    title?: string;
    first_name: string;
    last_name: string;
    telephone: string[];
    mobile: string[];
    email: string[];
    default: {
        telephone: string;
        email: string;
        mobile: string;
    }

    // TODO construct from a Caller?
    constructor() {
        this.default = {
            telephone: null,
            email: null,
            mobile: null
        };
    }
}
