import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { mergeMap, finalize, take } from 'rxjs/operators';

import { CALL_REASON } from 'src/app/common/constants/call-reason.constant';
import { CallService } from 'src/app/common/services/call.service';
import { HelperService } from 'src/app/common/services/helper.service';
import { ICallbackNoteParameters } from 'src/app/common/interfaces/callback-note-parameters';
import { ILogCallSelection } from 'src/app/common/interfaces/log-call-selection';
import { INCCInteraction } from 'src/app/common/interfaces/ncc-interaction';
import { NotesService } from 'src/app/common/services/notes.service';
import { NCCAPIService } from 'src/app/common/API/NCCAPI/ncc-api.service';
import { CallNatureDropdownComponent } from '../../components/call-nature/call-nature-dropdown/call-nature-dropdown.component';
import { CommsTelephoneComponent } from '../../components/comms-telephone/comms-telephone.component';
import { AuthService } from 'src/app/common/services/auth.service';
import { CallbackService } from 'src/app/main/services/callback.service';

@Component({
    selector: 'app-page-callback',
    templateUrl: './callback.component.html',
    styleUrls: ['./callback.component.scss']
})
export class PageCallbackComponent implements OnInit, OnDestroy, AfterViewInit {

    // A reference to the app-call-nature-dropdown.
    @ViewChild(CallNatureDropdownComponent)
    callNatureField: CallNatureDropdownComponent;

    // A reference to the app-comms-telephone.
    @ViewChild(CommsTelephoneComponent)
    telephoneField: CommsTelephoneComponent;

    sending: boolean;
    completed: boolean;
    error: boolean;

    form: {
        recipient: string;  // Recipient or Officer email address.
        ccEmail: string[]; // Team leader or Manager email address.
        contactNumber: string;
        callNature: ILogCallSelection;
        message: string;
        tenancyReference: string;
    }

    constructor(
        private Auth: AuthService,
        private Call: CallService,
        private Callback: CallbackService,
        private Helper: HelperService,
        private NCCAPI: NCCAPIService,
        private Notes: NotesService
    ) { }

    ngOnInit() {
        this._reset();
    }

    ngOnDestroy() {
        this.Callback.details = { ...this.form };
    }

    ngAfterViewInit() {
        setTimeout(() => { this._recover() }, 200);
    }

    /**
     *
     */
    numberSelected(number: string) {
        this.form.contactNumber = number;
    }

    /**
     *
     */
    natureSelected(call_nature: ILogCallSelection) {
        this.form.callNature = call_nature;
    }

    /**
     *
     */
    canSave(): boolean {
        return !this.sending &&
            this.Helper.isPopulated(this.form.recipient) &&
            this.Helper.isPopulated(this.form.contactNumber) &&
            this._isCallReasonDefined() &&
            this.Helper.isPopulated(this.form.message);
    }

    /**
     *
     */
    private _isCallReasonDefined() {
        if (this.Helper.isDefined(this.form.callNature) && this.Helper.isDefined(this.form.callNature.call_reason)) {
            return (CALL_REASON.OTHER !== this.form.callNature.call_reason.id) || (this.Helper.isPopulated(this.form.callNature.other_reason));
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
            recipientEmail: this.form.recipient,
            managerEmail: this.form.ccEmail[0],
            callbackNumber: this.form.contactNumber,
            message: this.form.message,
            callerName: this.Call.getCaller().getName(),
            tenancyReference: this.Call.getTenancyReference(),
            address: this.Call.getTenancy().address,
            fromName: this.Auth.getFullName()
        };

        this.sending = true;
        this.completed = false;
        this.error = false;

        // Using flatMap to subscribe to two Observables in series.
        // The call to sendCallbackEmail should not run if for some reason createCallbackNote fails.
        this.Notes.recordCallbackNote(this.form.callNature, callbackDetails)
            .pipe(take(1))
            .pipe(finalize(() => { this.sending = false; }))
            .pipe(mergeMap((data: INCCInteraction) => {
                // Response from recordCallbackNote().
                callbackDetails.callbackId = data.interactionId;
                return this.NCCAPI.sendCallbackEmail(callbackDetails);
            }))
            .subscribe(
                () => {
                    // TODO what happens next?
                    this.completed = true;
                    this._reset();
                },
                () => { this.error = true; }
            );
    }

    /**
     * Reset the form.
     */
    _reset() {
        this.form = {
            tenancyReference: this.Call.getTenancyReference(),
            recipient: null,
            ccEmail: [null],    // start with one!
            contactNumber: null,
            callNature: null,
            message: null
        };
        this.callNatureField.setCallNature(null);
        this.telephoneField.setDefault();
    }

    /**
     * Populate the form with "recovered" data.
     * This happens when the user leaves the callback page before completing their callback request.
     */
    private _recover() {
        this.form = Object.assign(this.form, this.Callback.details);

        if (this.form.callNature) {
            this.callNatureField.setCallNature(this.form.callNature);
        }

        this.telephoneField.selected = this.form.contactNumber || null;
    }

    /**
     * This
     */
    selectedRecipientEmail(result: string) {
        this.form.recipient = result;
    }

    /**
     *
     */
    selectedTeamLeaderEmail(a, b, c) {
        console.log(a, b, c);
        // this.form.teamLeader = result;
    }

    trackByFn(index: number, item: string) {
        return index;
    }
}
