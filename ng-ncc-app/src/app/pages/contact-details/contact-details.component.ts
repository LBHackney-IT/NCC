import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactDetailsUpdate } from '../../interfaces/contact-details-update.interface';
import { IdentifiedCaller } from '../../classes/identified-caller.class';
import { CallService } from '../../services/call.service';

@Component({
    selector: 'app-contact-details',
    templateUrl: './contact-details.component.html',
    styleUrls: ['./contact-details.component.scss']
})
export class PageContactDetailsComponent implements OnInit {

    // TODO this page will require the presence of an *identified* caller.

    MAX_OPTIONS = 5;    // maximum number of each contact method we can have for a caller.
    caller: IdentifiedCaller;
    details: ContactDetailsUpdate;
    new_telephone: string[];
    new_mobile: string[];
    new_email: string[];

    constructor(private route: ActivatedRoute, private Call: CallService) { }

    ngOnInit() {
        // TODO build the details from the caller's information.

        this.new_telephone = [];
        this.new_mobile = [];
        this.new_email = [];

        this.route.data.subscribe((data) => {
            this.caller = data.caller;
            this._buildDetails();
        });
    }

    _buildDetails() {
        this.details = new ContactDetailsUpdate;
        this.details.title = this.caller.getTitle();
        this.details.first_name = this.caller.getFirstName();
        this.details.last_name = this.caller.getLastName();
        // this.details.telephone = this.caller.getTelephoneNumbers();
        // - currently no distinction between mobile and telephone numbers.
        this.details.mobile = this.caller.getTelephoneNumbers();
        this.details.email = this.caller.getEmailAddresses();

        // If there's only one of each contact method, set it as the default.
        if (1 === this.details.mobile.length) {
            this.details.default.mobile = this.details.mobile[0];
        }
        if (1 === this.details.email.length) {
            this.details.default.email = this.details.email[0];
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

    hasEnoughMobileNumbers(): boolean {
        const existing = this.details.mobile.length;
        const added = this.new_mobile.length;
        return this.MAX_OPTIONS <= (existing + added);
    }

    hasEnoughEmailAddresses(): boolean {
        const existing = this.details.email.length;
        const added = this.new_email.length;
        return this.MAX_OPTIONS <= (existing + added);
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
