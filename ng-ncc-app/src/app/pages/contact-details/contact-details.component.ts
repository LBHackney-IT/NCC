import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { finalize, take } from 'rxjs/operators';

import { PAGES } from '../../constants/pages.constant';
import { IContactDetails } from '../../interfaces/contact-details';
import { ContactDetailsUpdate } from '../../classes/contact-details-update.class';
import { IdentifiedCaller } from '../../classes/identified-caller.class';
import { CallService } from '../../services/call.service';
import { NCCAPIService } from '../../API/NCCAPI/ncc-api.service';
import { BackLinkService } from '../../services/back-link.service';
import { ViewOnlyService } from '../../services/view-only.service';
import { PageTitleService } from '../../services/page-title.service';

@Component({
    selector: 'app-contact-details',
    templateUrl: './contact-details.component.html',
    styleUrls: ['./contact-details.component.scss']
})
export class PageContactDetailsComponent implements OnInit, OnDestroy {

    // TODO it doesn't make much sense to create a new call (which happens from the identify tenant page) in order to edit contact details.
    // I would think that editing contact details would be an option available from the navigation, once a tenant has been identified.
    // However, this is how the feature was intended to work.

    private _destroyed$ = new Subject();

    MAX_OPTIONS = 0;        // maximum number of each contact method we can have for a caller (set to 0 for infinite).
    caller: IdentifiedCaller;
    new_telephone: string[];
    new_mobile: string[];
    new_email: string[];
    saving: boolean;
    error: boolean;
    saving_error: boolean;
    update: ContactDetailsUpdate;
    view_only: boolean;

    constructor(
        private route: ActivatedRoute,
        private NCCAPI: NCCAPIService,
        private Call: CallService,
        private BackLink: BackLinkService,
        private ViewOnly: ViewOnlyService,
        private PageTitle: PageTitleService) { }

    ngOnInit() {
        this.PageTitle.set(PAGES.EDIT_CONTACT_DETAILS.label);

        this._resetDetails();

        this.route.data
            .pipe(take(1))
            .subscribe(
                (data: { caller: IdentifiedCaller, details: ContactDetailsUpdate }) => {
                    this._buildDetails(data.caller, data.details);
                },
                () => { this.error = true; }
            );

        // Enable the app's back link.
        this.BackLink.enable();
        this.BackLink.setTarget(`/${PAGES.IDENTIFY.route}/${PAGES.IDENTIFY_TENANTS.route}`);

        this.view_only = this.ViewOnly.status;
    }

    ngOnDestroy() {
        this._destroyed$.next();
    }

    /**
     *
     */
    private _resetDetails() {
        this.update = new ContactDetailsUpdate;
        this.new_telephone = [];
        this.new_mobile = [];
        this.new_email = [];
    }

    /**
     * Populates our form model with the identified caller's existing details.
     */
    private _buildDetails(caller: IdentifiedCaller, details: ContactDetailsUpdate) {
        this.caller = caller;

        // TELEPHONE
        // Do we have existing details from the NCC API?
        if (details && details.telephone) {
            this.update.telephone = details.telephone;
        } else {
            // "Import" telephone numbers from the Hackney API results.
            // - currently no distinction between mobile and telephone numbers.
        }

        // MOBILE
        // Do we have existing details from the NCC API?
        if (details && details.mobile) {
            this.update.mobile = details.mobile;
        } else {
            // "Import" mobile numbers from the Hackney API results.
            this.update.mobile = caller.getTelephoneNumbers();
        }

        // EMAIL
        // Do we have existing details from the NCC API?
        if (details && details.email) {
            this.update.email = details.email;
        } else {
            // "Import" email addresses from the Hackney API results.
            this.update.email = caller.getEmailAddresses();
        }

        // If there's only one of each contact method, set it as the default.
        if (1 === this.update.telephone.length) {
            this.update.default.telephone = this.update.telephone[0];
        }
        if (1 === this.update.mobile.length) {
            this.update.default.mobile = this.update.mobile[0];
        }
        if (1 === this.update.email.length) {
            this.update.default.email = this.update.email[0];
        }
    }

    /**
     * Add an extra field for a new [home] telephone number.
     */
    addTelephoneNumber() {
        // Only add a new field if there are no empty fields.
        if (this._hasNoEmptyFields(this.new_telephone)) {
            this.new_telephone.push(null);
            this.update.default.telephone = null;
        }
    }

    /**
     * Add an extra field for a new mobile telephone number.
     */
    addMobileNumber() {
        // Only add a new field if there are no empty fields.
        if (this._hasNoEmptyFields(this.new_mobile)) {
            this.new_mobile.push(null);
            this.update.default.mobile = null;
        }
    }

    /**
     * Add an extra field for a new email address.
     */
    addEmailAddress() {
        // Only add a new field if there are no empty fields.
        if (this._hasNoEmptyFields(this.new_email)) {
            this.new_email.push(null);
            this.update.default.email = null;
        }
    }

    /**
     * Returns TRUE if we have the maximum number of telephone numbers allowed.
     */
    hasEnoughTelephoneNumbers(): boolean {
        const existing = this.update.telephone.length;
        const added = this.new_telephone.length;
        return this.MAX_OPTIONS && this.MAX_OPTIONS <= (existing + added);
    }

    /**
     * Returns TRUE if we have the maximum number of mobile numbers allowed.
     */
    hasEnoughMobileNumbers(): boolean {
        const existing = this.update.mobile.length;
        const added = this.new_mobile.length;
        return this.MAX_OPTIONS && this.MAX_OPTIONS <= (existing + added);
    }

    /**
     * Returns TRUE if we have the maximum number of email addresses allowed.
     */
    hasEnoughEmailAddresses(): boolean {
        const existing = this.update.email.length;
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
        const new_details = Object.assign(new ContactDetailsUpdate, this.update); // Create a copy.
        new_details.telephone = new_details.telephone.concat(this.new_telephone);
        new_details.mobile = new_details.mobile.concat(this.new_mobile);
        new_details.email = new_details.email.concat(this.new_email);

        new_details.sanitise();

        this.saving = true;
        this.saving_error = false;

        let observe;
        if (this.ViewOnly.status) {
            observe = of([]);
        } else {
            observe = this.NCCAPI.saveContactDetails(caller.getContactID(), new_details);
        }
        observe
            .pipe(take(1))
            .pipe(finalize(() => {
                this.saving = false;
            }))
            .subscribe(
                () => {
                    this.update = new_details;
                    this.new_telephone = [];
                    this.new_mobile = [];
                    this.new_email = [];
                },
                () => { this.saving_error = true; }
            );
    }

}
