import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PAGES } from '../../constants/pages.constant';
import { IContactDetails } from '../../interfaces/contact-details';
import { ContactDetailsUpdate } from '../../classes/contact-details-update.class';
import { IdentifiedCaller } from '../../classes/identified-caller.class';
import { CallService } from '../../services/call.service';
import { NCCAPIService } from '../../API/NCCAPI/ncc-api.service';
import { BackLinkService } from '../../services/back-link.service';
import { PageTitleService } from '../../services/page-title.service';

@Component({
    selector: 'app-contact-details',
    templateUrl: './contact-details.component.html',
    styleUrls: ['./contact-details.component.scss']
})
export class PageContactDetailsComponent implements OnInit, OnDestroy {

    private _destroyed$ = new Subject();

    MAX_OPTIONS = 0;        // maximum number of each contact method we can have for a caller (set to 0 for infinite).
    new_telephone: string[];
    new_mobile: string[];
    new_email: string[];
    _saving: boolean;
    error: boolean;
    saving_error: boolean;

    details: {
        original: IContactDetails,
        update: ContactDetailsUpdate
    };

    constructor(private route: ActivatedRoute, private NCCAPI: NCCAPIService, private Call: CallService,
        private BackLink: BackLinkService, private PageTitle: PageTitleService) { }

    ngOnInit() {
        this.PageTitle.set(PAGES.EDIT_CONTACT_DETAILS.label);

        this.details = {
            original: null,
            update: new ContactDetailsUpdate
        };
        this.new_telephone = [];
        this.new_mobile = [];
        this.new_email = [];

        this.route.data
            .pipe(
                takeUntil(this._destroyed$)
            )
            .subscribe(
                (data) => { this._buildDetails(data.details); },
                () => { this.error = true; }
            );

        // Enable the app's back link.
        this.BackLink.enable();
        this.BackLink.setTarget(`/${PAGES.IDENTIFY.route}/${PAGES.IDENTIFY_TENANTS.route}`);
    }

    ngOnDestroy() {
        this._destroyed$.next();
    }

    /**
     * Populates our form model with the identified caller's existing details.
     */
    _buildDetails(details: IContactDetails) {
        this.details.original = details;
        // this.details.update = new ContactDetailsUpdate;

        this.details.update.telephone = [];
        // this.details.telephone = this.caller.getTelephoneNumbers();
        // - currently no distinction between mobile and telephone numbers.
        this.details.update.mobile = [
            details.telephone1,
            details.telephone2,
            details.telephone3
        ].filter(row => row);
        this.details.update.email = [
            details.emailAddress
        ].filter(row => row);

        // If there's only one of each contact method, set it as the default.
        if (1 === this.details.update.telephone.length) {
            this.details.update.default.telephone = this.details.update.telephone[0];
        }
        if (1 === this.details.update.mobile.length) {
            this.details.update.default.mobile = this.details.update.mobile[0];
        }
        if (1 === this.details.update.email.length) {
            this.details.update.default.email = this.details.update.email[0];
        }
    }

    /**
     * Add an extra field for a new [home] telephone number.
     */
    addTelephoneNumber() {
        // Only add a new field if there are no empty fields.
        if (this._hasNoEmptyFields(this.new_telephone)) {
            this.new_telephone.push(null);
            this.details.update.default.telephone = null;
        }
    }

    /**
     * Add an extra field for a new mobile telephone number.
     */
    addMobileNumber() {
        // Only add a new field if there are no empty fields.
        if (this._hasNoEmptyFields(this.new_mobile)) {
            this.new_mobile.push(null);
            this.details.update.default.mobile = null;
        }
    }

    /**
     * Add an extra field for a new email address.
     */
    addEmailAddress() {
        // Only add a new field if there are no empty fields.
        if (this._hasNoEmptyFields(this.new_email)) {
            this.new_email.push(null);
            this.details.update.default.email = null;
        }
    }

    /**
     * Returns TRUE if we have the maximum number of telephone numbers allowed.
     */
    hasEnoughTelephoneNumbers(): boolean {
        const existing = this.details.update.telephone.length;
        const added = this.new_telephone.length;
        return this.MAX_OPTIONS && this.MAX_OPTIONS <= (existing + added);
    }

    /**
     * Returns TRUE if we have the maximum number of mobile numbers allowed.
     */
    hasEnoughMobileNumbers(): boolean {
        const existing = this.details.update.mobile.length;
        const added = this.new_mobile.length;
        return this.MAX_OPTIONS && this.MAX_OPTIONS <= (existing + added);
    }

    /**
     * Returns TRUE if we have the maximum number of email addresses allowed.
     */
    hasEnoughEmailAddresses(): boolean {
        const existing = this.details.update.email.length;
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
    saveDetails() {
        const caller = this.Call.getCaller();
        const new_details = Object.assign(new ContactDetailsUpdate, this.details.update); // Create a copy.
        new_details.telephone = new_details.telephone.concat(this.new_telephone);
        new_details.mobile = new_details.mobile.concat(this.new_mobile);
        new_details.email = new_details.email.concat(this.new_email);

        new_details.sanitise();

        this._saving = true;
        this.saving_error = false;

        const subscription = this.NCCAPI.saveContactDetails(caller.getContactID(), new_details)
            .subscribe(
                () => {
                    this.details.update = new_details;
                    this.new_telephone = [];
                    this.new_mobile = [];
                    this.new_email = [];
                },
                () => { this.saving_error = true; },
                () => {
                    subscription.unsubscribe();
                    this._saving = false;
                }
            );
    }

}
