import { CONTACT } from '../constants/contact.constant';
import { CommsTemplate } from '../classes/comms-template.class';

export class CommsOption {
    name: string;
    templates: object;

    constructor(name: string) {
        this.name = name;
        this.templates = new Object;
        this.templates[CONTACT.METHOD_EMAIL] = null;
        this.templates[CONTACT.METHOD_POST] = null;
        this.templates[CONTACT.METHOD_SMS] = null;
    }

    addTemplate(type: string, template: CommsTemplate) {
        if (this.templates.hasOwnProperty(type)) {
            this.templates[type] = template;
        } else {
            throw new Error('Invalid template type: ' + type);
        }
    }

    hasTemplate(type: string): boolean {
        return (this.templates.hasOwnProperty(type) && (null !== this.templates[type]));
    }

}
