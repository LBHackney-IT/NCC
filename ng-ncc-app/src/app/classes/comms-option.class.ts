import { CONTACT } from '../constants/contact.constant';
import { CommsTemplate } from '../classes/comms-template.class';

export class CommsOption {
    SENSITIVE_PREFIX_SEARCH = 'Sensitive: ';
    SENSITIVE_PREFIX_REPLACE = 'DPA: ';

    _sensitive: boolean;
    displayName: string;
    templates: {};

    constructor(public name: string) {
        // defining public parameters allows us to create and set the respective class property.

        this.templates = new Object;
        this.templates[CONTACT.METHOD_EMAIL] = null;
        this.templates[CONTACT.METHOD_POST] = null;
        this.templates[CONTACT.METHOD_SMS] = null;

        this._checkForSensitivity();
    }

    /**
     * Checks whether this comms template is considered "sensitive", i.e. requires DPA identification to access.
     */
    _checkForSensitivity() {
        if (-1 !== this.name.indexOf(this.SENSITIVE_PREFIX_SEARCH)) {
            // This is a sensitive comms template.
            this._sensitive = true;
            this.displayName = this.name.replace(this.SENSITIVE_PREFIX_SEARCH, this.SENSITIVE_PREFIX_REPLACE);
        } else {
            // This is not a sensitive comms template.
            this._sensitive = false;
            this.displayName = this.name;
        }
    }

    /**
     * Adds a template corresponding to a communications method.
     */
    addTemplate(type: string, template: CommsTemplate) {
        if (this.templates.hasOwnProperty(type)) {
            this.templates[type] = template;
        } else {
            throw new Error('Invalid template type: ' + type);
        }
    }


    /**
     * Checks whether a template exists for a specific communications method.
     */
    hasTemplate(type: string): boolean {
        return (this.templates.hasOwnProperty(type) && (null !== this.templates[type]));
    }


    /**
     * Returns TRUE if this set of communications templates are considered "sensitive".
     */
    isSensitive(): boolean {
        return this._sensitive;
    }

}
