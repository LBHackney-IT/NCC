import { Component, OnInit } from '@angular/core';
import { ContactDetailsUpdate } from '../../interfaces/contact-details-update.interface';

@Component({
    selector: 'app-contact-details',
    templateUrl: './contact-details.component.html',
    styleUrls: ['./contact-details.component.scss']
})
export class PageContactDetailsComponent implements OnInit {

    // TODO this page will require the presence of an *identified* caller.

    details: ContactDetailsUpdate;
    new_telephone: string[];
    new_mobile: string[];
    new_email: string[];

    constructor() { }

    ngOnInit() {
        // TODO build the details from the caller's information.
        this.details = new ContactDetailsUpdate;

        this.new_telephone = [];
        this.new_mobile = [];
        this.new_email = [];
    }

    /**
     * Add an extra field for a new home telephone number.
     */
    addHomeNumber() {
        // Only add a new field if there are no empty fields.
        if (this._hasNoEmptyFields(this.new_telephone)) {
            this.new_telephone.push(null);
            this.details.default.telephone = null;
        }
    }

    /**
     * Add an extra field for a new mobile telephone number.
     */
    addMobileNumber() {
        // Only add a new field if there are no empty fields.
        if (this._hasNoEmptyFields(this.new_mobile)) {
            this.new_mobile.push(null);
            this.details.default.mobile = null;
        }
    }

    /**
     * Add an extra field for a new email address.
     */
    addEmailAddress() {
        // Only add a new field if there are no empty fields.
        if (this._hasNoEmptyFields(this.new_email)) {
            this.new_email.push(null);
            this.details.default.email = null;
        }
    }

    /**
     * Returns TRUE if the provided list of values has no empty values.
     */
    _hasNoEmptyFields(list: string[]): boolean {
        const empty_fields = list.filter((v) => null === v || 0 === v.length);
        return !!(0 === empty_fields.length);
    }

    /**
     * A method used by ngFor loops in the template to compare items, for determining whether the item has changed.
     * We have to provide this ourselves in Angular.
     */
    trackByIndex(index: number, value: any): number {
        return index;
    }

}
