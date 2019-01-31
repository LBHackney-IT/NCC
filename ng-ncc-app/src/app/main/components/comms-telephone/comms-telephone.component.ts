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
                (error) => {
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
        this.telephoneNumbers = [];
        if (this.details.telephone) {
            this.telephoneNumbers = this.telephoneNumbers.concat(this.details.telephone);
        }
        if (this.details.mobile) {
            this.telephoneNumbers = this.telephoneNumbers.concat(this.details.mobile);
        }

        // Set the default number to use, if available.
        this.setDefault();
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
