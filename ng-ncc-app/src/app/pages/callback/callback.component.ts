import { Component, OnInit } from '@angular/core';

import { CALL_REASON } from '../../constants/call-reason.constant';
import { ILogCallSelection } from '../../interfaces/log-call-selection';
import { HelperService } from '../../services/helper.service';
import { NotesService } from '../../services/notes.service';

@Component({
    selector: 'app-page-callback',
    templateUrl: './callback.component.html',
    styleUrls: ['./callback.component.scss']
})
export class PageCallbackComponent implements OnInit {

    recipient: string;  // Recipient or Officer email address.
    teamLeader: string; // Team leader or Manager email address.
    contactNumber: string;
    callNature: ILogCallSelection;
    message: string;

    constructor(private Helper: HelperService, private Notes: NotesService) { }

    ngOnInit() {
        this._reset();
    }

    /**
     *
     */
    numberSelected(number: string) {
        this.contactNumber = number;
    }

    /**
     *
     */
    natureSelected(call_nature: ILogCallSelection) {
        this.callNature = call_nature;
    }

    /**
     *
     */
    canSave(): boolean {
        return this.Helper.isDefined(this.contactNumber) &&
            (this.Helper.isDefined(this.callNature.call_reason) &&
                (CALL_REASON.OTHER !== this.callNature.call_reason.id || this.Helper.isPopulated(this.callNature.other_reason))) &&
            this.Helper.isPopulated(this.message);
    }

    /**
     *
     */
    saveCallbackRequest() {

    }

    /**
     *
     */
    _reset() {
        this.recipient = null;
        this.teamLeader = null;
        this.contactNumber = null;
        this.callNature = null;
        this.message = null;
    }

}
