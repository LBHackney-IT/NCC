import { Component, EventEmitter, Input, OnChanges, OnInit, OnDestroy, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

import { CONTACT } from '../../../common/constants/contact.constant';
import { CommsSelection } from '../../../common/classes/comms-selection.class';
import { ICommsMethodDetails } from '../../../common/interfaces/comms-method-details';
import { CallService } from '../../../common/services/call.service';
import { ICaller } from '../../../common/interfaces/caller';
import { NCCAPIService } from '../../../common/API/NCCAPI/ncc-api.service';
import { ContactDetailsUpdate } from '../../../common/classes/contact-details-update.class';

@Component({
    selector: 'app-comms-method-select',
    templateUrl: './comms-method-select.component.html',
    styleUrls: ['./comms-method-select.component.scss']
})
export class CommsMethodSelectComponent implements OnInit, OnChanges, OnDestroy {
    // Whether to enable or disable communications methods.
    // (Question marks indicate that the properties are optional.)
    @Input() disableEmail?: boolean;
    @Input() disablePost?: boolean;
    @Input() disableSMS?: boolean;
    @Input() postText?: string;

    // Pass the selected comms method and details through an [Observable] event.
    @Output() selected = new EventEmitter<CommsSelection>();
    @Output() invalidated = new EventEmitter<void>();

    private _destroyed$ = new Subject();

    // A reference to the ICaller we want to contact.
    caller: ICaller;
    details: ContactDetailsUpdate;
    selection: CommsSelection;

    methods = CONTACT;

    constructor(private Call: CallService, private NCCAPI: NCCAPIService) { }

    ngOnInit() {
        this.caller = this.Call.getCaller();
        this.selection = new CommsSelection;
        this.NCCAPI.getContactDetails(this.caller.getContactID())
            .pipe(takeUntil(this._destroyed$))
            .pipe(finalize(() => {
                this._setDefaults();
            }))
            .subscribe(
                (data: ContactDetailsUpdate) => {
                    if (null === data) {
                        this._useCallerInformation();
                    } else {
                        this.details = data;
                    }
                },
                (error) => {
                    // No contact details (with defaults) were available for this caller, so we will use
                    // available information from the caller.
                    this._useCallerInformation();
                });

    }

    /**
     *
     */
    reset() {
        this.selection = new CommsSelection;
        this.postText = null;
    }

    /**
     *
     */
    _useCallerInformation() {
        const details = new ContactDetailsUpdate;
        details.mobile = this.caller.getTelephoneNumbers();
        details.email = this.caller.getEmailAddresses();
        this.details = details;
    }

    _setDefaults() {
        if (this.details) {
            this.selection.existing[CONTACT.METHOD_EMAIL] = this.details.default.email || [].concat(this.details.email).pop();
            this.selection.existing[CONTACT.METHOD_SMS] = this.details.default.mobile || [].concat(this.details.mobile).pop();
        }
    }

    /**
     * Respond to changes with the component's properties, INCLUDING on initialisation.
     */
    ngOnChanges() {
        // If the currently selected method has been disabled, deselect it.
        if (this.selection) {
            let condition: boolean;
            switch (this.selection.method) {
                case CONTACT.METHOD_EMAIL:
                    condition = this.disableEmail;
                    break;
                case CONTACT.METHOD_POST:
                    condition = this.disablePost;
                    break;
                case CONTACT.METHOD_SMS:
                    condition = this.disableSMS;
                    break;
            }
            if (condition) {
                this.selection.method = null;
                this.invalidated.emit();
            }
        }
    }

    /**
     *
     */
    ngOnDestroy() {
        this._destroyed$.next();
    }

    /**
     *
     */
    trackByMethod(index: number, item: string): number {
        return index;
    }

    /**
     * Called if we're beginning to add a new detail for the selected method.
     */
    prepareNewDetail(key: string) {
        this.selection.existing[key] = null;
        this.checkDetails();
    }

    /**
     * Returns a list of the caller's email addresses.
     */
    existingEmailAddresses(): string[] {
        return this.details ? this.details.email : [];
    }

    /**
     * Returns a list of the caller's telephone numbers.
     */
    existingTelephoneNumbers(): string[] {
        return this.details ? this.details.mobile : [];
    }

    /**
     *
     */
    checkDetails() {
        this.selected.emit(this.selection);
    }

    /**
     *
     */
    isEmailSelected(): boolean {
        return CONTACT.METHOD_EMAIL === this.selection.method;
    }

    /**
     *
     */
    isMobileSelected(): boolean {
        return CONTACT.METHOD_SMS === this.selection.method;
    }

    /**
     *
     */
    isPostSelected(): boolean {
        return CONTACT.METHOD_POST === this.selection.method;
    }

}
