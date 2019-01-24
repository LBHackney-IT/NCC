import { Component, OnInit } from '@angular/core';
import { mergeMap, finalize, take } from 'rxjs/operators';

import { CALL_REASON } from '../../constants/call-reason.constant';
import { CallService } from '../../services/call.service';
import { HelperService } from '../../services/helper.service';
import { ICallbackNoteParameters } from '../../interfaces/callback-note-parameters';
import { ILogCallSelection } from '../../interfaces/log-call-selection';
import { INCCInteraction } from '../../interfaces/ncc-interaction';
import { NotesService } from '../../services/notes.service';
import { NCCAPIService } from '../../API/NCCAPI/ncc-api.service';

@Component({
    selector: 'app-page-callback',
    templateUrl: './callback.component.html',
    styleUrls: ['./callback.component.scss']
})
export class PageCallbackComponent implements OnInit {

    sending: boolean;
    error: boolean;
    recipient: string;  // Recipient or Officer email address.
    teamLeader: string; // Team leader or Manager email address.
    contactNumber: string;
    callNature: ILogCallSelection;
    message: string;
    tenancyReference: string;

    constructor(
        private Call: CallService,
        private Helper: HelperService,
        private NCCAPI: NCCAPIService,
        private Notes: NotesService
    ) { }

    ngOnInit() {
        this._reset();
        this.tenancyReference = this.Call.getTenancyReference();
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
        return !this.sending &&
            this.Helper.isDefined(this.recipient) &&
            this.Helper.isDefined(this.contactNumber) &&
            this._isCallReasonDefined() &&
            this.Helper.isPopulated(this.message);
    }

    /**
     *
     */
    private _isCallReasonDefined() {
        if (this.Helper.isDefined(this.callNature) && this.Helper.isDefined(this.callNature.call_reason)) {
            return (CALL_REASON.OTHER !== this.callNature.call_reason.id) || (this.Helper.isPopulated(this.callNature.other_reason));
        }
        return false;
    }

    /**
     *
     */
    saveCallbackRequest() {
        if (this.sending) {
            return;
        }

        const callbackDetails: ICallbackNoteParameters = {
            recipientEmail: this.recipient,
            managerEmail: this.teamLeader,
            callbackNumber: this.contactNumber
        };

        this.sending = true;
        this.error = false;

        // Using flatMap to subscribe to two Observables in series.
        // The call to sendCallbackEmail should not run if for some reason createCallbackNote fails.
        this.Notes.recordCallbackNote(this.message, this.callNature, callbackDetails)
            .pipe(take(1))
            .pipe(finalize(() => { this.sending = false; }))
            .pipe(mergeMap((data: INCCInteraction) => {
                // Response from recordCallbackNote().
                callbackDetails.callbackId = data.interactionId;
                return this.NCCAPI.sendCallbackEmail(callbackDetails);
            }))
            .subscribe(
                (response) => { console.log(response) },
                (error) => { this.error = true; }
            );
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
