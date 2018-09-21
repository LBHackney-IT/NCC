import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactDetails } from '../../interfaces/contact-details.interface';
import { ContactDetailsUpdate } from '../../classes/contact-details-update.class';
import { IdentifiedCaller } from '../../classes/identified-caller.class';
import { CallService } from '../../services/call.service';

@Component({
    selector: 'app-contact-details',
    templateUrl: './contact-details.component.html',
    styleUrls: ['./contact-details.component.scss']
})
export class PageContactDetailsComponent implements OnInit {

    MAX_OPTIONS = 0;        // maximum number of each contact method we can have for a caller (set to 0 for infinite).
    details: ContactDetailsUpdate;
    new_telephone: string[];
    new_mobile: string[];
    new_email: string[];

    constructor(private route: ActivatedRoute, private Call: CallService) { }

    ngOnInit() {
        this.new_telephone = [];
        this.new_mobile = [];
        this.new_email = [];

        this.route.data.subscribe((data) => {
            console.log('Contact details:', data.details);
            this._buildDetails(data.details);
        });
    }

    /**
     * Populates our form model with the identified caller's existing details.
     */
    _buildDetails(details: ContactDetails) {
        this.details = new ContactDetailsUpdate;
        this.details.title = details.title;
        this.details.first_name = details.firstName;
        this.details.last_name = details.lastName;
        this.details.telephone = [];
        // this.details.telephone = this.caller.getTelephoneNumbers();
        // - currently no distinction between mobile and telephone numbers.
        this.details.mobile = [
            details.telephone1,
            details.telephone2,
            details.telephone3
        ].filter(row => row);
        this.details.email = [
            details.emailAddress
        ].filter(row => row);

        // If there's only one of each contact method, set it as the default.
        if (1 === this.details.telephone.length) {
            this.details.default.telephone = this.details.telephone[0];
        }
        if (1 === this.details.mobile.length) {
            this.details.default.mobile = this.details.mobile[0];
        }
        if (1 === this.details.email.length) {
            this.details.default.email = this.details.email[0];
        }
    }

    /**
     * Add an extra field for a new [home] telephone number.
     */
    addTelephoneNumber() {
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
     * Returns TRUE if we have the maximum number of telephone numbers allowed.
     */
    hasEnoughTelephoneNumbers(): boolean {
        const existing = this.details.telephone.length;
        const added = this.new_telephone.length;
        return this.MAX_OPTIONS && this.MAX_OPTIONS <= (existing + added);
    }

    /**
     * Returns TRUE if we have the maximum number of mobile numbers allowed.
     */
    hasEnoughMobileNumbers(): boolean {
        const existing = this.details.mobile.length;
        const added = this.new_mobile.length;
        return this.MAX_OPTIONS && this.MAX_OPTIONS <= (existing + added);
    }

    /**
     * Returns TRUE if we have the maximum number of email addresses allowed.
     */
    hasEnoughEmailAddresses(): boolean {
        const existing = this.details.email.length;
        const added = this.new_email.length;
        return this.MAX_OPTIONS && this.MAX_OPTIONS <= (existing + added);
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

    /**
     * Attempts to save the entered contact details for the caller.
     */
    saveDetails(event) {
        if (event && event.defaultPrevented) {
            return;
        }
        console.log('Name saved as:', this.details.title, this.details.first_name, this.details.last_name);
        console.log('Telephone number saved as:', this.details.telephone);
        console.log('Mobile numbers saved as:', this.details.mobile.concat(this.new_mobile));
        console.log('Email addresses saved as:', this.details.email.concat(this.new_email));
        console.log('Default mobile number is:', this.details.default.mobile);
        console.log('Default email address is:', this.details.default.email);
    }

}
