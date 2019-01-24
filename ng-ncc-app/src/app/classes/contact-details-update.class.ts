/**
 * This interface is used for managing the update of a caller's contact details.
 */
export class ContactDetailsUpdate {
    // title?: string;
    // first_name: string;
    // last_name: string;
    // telephone: string;
    telephone: string[] = [];
    mobile: string[] = [];
    email: string[] = [];
    default: {
        email: string;
        mobile: string;
        telephone: string;
    };

    // TODO construct from an ICaller?
    constructor() {
        this.default = {
            email: null,
            mobile: null,
            telephone: null
        };
    }

    /**
     * Cleans up the contact details.
     */
    sanitise() {
        // Remove any empty rows.
        this.telephone = this.telephone.filter((d) => d.length > 0);
        this.mobile = this.mobile.filter((d) => d.length > 0);
        this.email = this.email.filter((d) => d.length > 0);

        // Remove duplicates.
        // https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_uniq
        this.telephone = Array.from(new Set(this.telephone));
        this.mobile = Array.from(new Set(this.mobile));
        this.email = Array.from(new Set(this.email));

        // Select the newest items as the default if one hasn't been selected.
        // https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_last
        if (!this.default.telephone && this.telephone.length) {
            this.default.telephone = [].concat(this.telephone).pop();
        }
        if (!this.default.mobile && this.mobile.length) {
            this.default.mobile = [].concat(this.mobile).pop();
        }
        if (!this.default.email && this.email.length) {
            this.default.email = [].concat(this.email).pop();
        }
    }
}
