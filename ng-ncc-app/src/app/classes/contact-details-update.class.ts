/**
 * This interface is used for managing the update of a caller's contact details.
 */
export class ContactDetailsUpdate {
    title?: string;
    first_name: string;
    last_name: string;
    // telephone: string;
    telephone: string[];
    mobile: string[];
    email: string[];
    default: {
        email: string;
        mobile: string;
        telephone: string;
    };

    // TODO construct from a Caller?
    constructor() {
        this.default = {
            email: null,
            mobile: null,
            telephone: null
        };
    }
}
