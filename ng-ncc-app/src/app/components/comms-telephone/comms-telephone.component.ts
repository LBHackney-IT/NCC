import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CallService } from '../../services/call.service';
import { ICaller } from '../../interfaces/caller';
import { NCCAPIService } from '../../API/NCCAPI/ncc-api.service';
import { ContactDetailsUpdate } from '../../classes/contact-details-update.class';

@Component({
    selector: 'app-comms-telephone',
    templateUrl: './comms-telephone.component.html',
    styleUrls: ['./comms-telephone.component.scss']
})
export class CommsTelephoneComponent implements OnInit {
    @Output() selectedChange = new EventEmitter<string>();

    private _destroyed$ = new Subject();

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
     *
     */
    _populateTelephoneNumbers(details: ContactDetailsUpdate) {
        // Add all available telephone numbers to the list.
        this.telephoneNumbers = [];
        if (details.telephone) {
            this.telephoneNumbers = this.telephoneNumbers.concat(details.telephone);
        }
        if (details.mobile) {
            this.telephoneNumbers = this.telephoneNumbers.concat(details.mobile);
        }

        // Set the default number to use, if available.
        if (details.default.telephone) {
            this.selected = details.default.telephone;
        } else if (details.default.mobile) {
            this.selected = details.default.mobile;
        }
    }

    trackByFn(index, item) {
        return index; // or item.id
    }

    setSelectedAsOther() {
        this.selected = null;
    }

    changedSelection() {
        const number = this.selected ? this.selected : this.otherNumber;
        this.selectedChange.emit(number);
    }

}
