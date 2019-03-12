import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CallService } from '../../../common/services/call.service';
import { ICaller } from '../../../common/interfaces/caller';
import { NCCAPIService } from '../../../common/API/NCCAPI/ncc-api.service';
import { ContactDetailsUpdate } from '../../../common/classes/contact-details-update.class';

@Component({
    selector: 'app-comms-telephone',
    templateUrl: './comms-telephone.component.html',
    styleUrls: ['./comms-telephone.component.scss']
})
export class CommsTelephoneComponent implements OnInit {
    @Input() disabled: boolean;
    @Output() selectedChange = new EventEmitter<string>();

    private _destroyed$ = new Subject();

    caller: ICaller;
    details: ContactDetailsUpdate;
    selected: string; // the selected or entered telephone number.
    otherNumber: string;
    telephoneNumbers: string[]; // all available telephone numbers.

    constructor(private Call: CallService, private NCCAPI: NCCAPIService) { }

    ngOnInit() {
        this.caller = this.Call.getCaller();
        this.NCCAPI.getContactDetails(this.caller.getContactID())
            .pipe(takeUntil(this._destroyed$))
            .subscribe(
                (data: ContactDetailsUpdate) => {
                    if (null === data) {
                        this._useCallerInformation();
                    } else {
                        this._populateTelephoneNumbers(data);
                    }
                    this.changedSelection();
                },
                () => {
                    // No contact details (with defaults) were available for this caller, so we will use
                    // available information from the caller.
                    this._useCallerInformation();
                });

    }

    /**
     *
     */
    _useCallerInformation() {
        const details = new ContactDetailsUpdate;
        details.mobile = this.caller.getTelephoneNumbers();
        this._populateTelephoneNumbers(details);
    }

    /**
     *  Add all available telephone numbers to the list.
     */
    _populateTelephoneNumbers(details: ContactDetailsUpdate) {
        this.details = details;

        // Because there was previously no validation, a tenant might have duplicate telephone numbers.
        // We will have to make sure there aren't any duplicates after combining both lists of numbers.
        const allNumbers = (this.details.telephone || []).concat(this.details.mobile || []);
        this.telephoneNumbers = Array.from(new Set(allNumbers));

        if (this.selected) {
            // A telephone number has already been selected; find out whether it's in the list
            // or is considered an "other" number.
            if (this.telephoneNumbers.indexOf(this.selected) === -1) {
                this.otherNumber = this.selected;
                this.selected = null;
            }
        } else {
            // Set the default number to use, if available.
            this.setDefault();
        }
    }

    /**
     *  Sets the selected telephone number to the default, if available.
     */
    setDefault() {
        this.selected = null;
        if (this.details) {
            if (this.details.default.telephone) {
                this.selected = this.details.default.telephone;
            } else if (this.details.default.mobile) {
                this.selected = this.details.default.mobile;
            }
        }
    }

    /**
     *
     */
    trackByFn(index, item) {
        return index; // or item.id
    }

    /**
     *
     */
    setSelectedAsOther() {
        this.selected = null;
    }

    /**
     *
     */
    changedSelection() {
        const number = this.selected ? this.selected : this.otherNumber;
        this.selectedChange.emit(number);
    }

    /**
     *
     */
    reset() {
        this.otherNumber = null;
        this.setDefault();
    }

}
