import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { finalize, take, map } from 'rxjs/operators';

import { HackneyAPIService } from '../../../common/API/HackneyAPI/hackney-api.service';
import { NCCAPIService } from '../../../common/API/NCCAPI/ncc-api.service';
import { HelperService } from '../../../common/services/helper.service';
import { ICallbackDetails } from '../../../common/interfaces/callback-details';
import { ICallbackResponse } from '../../../common/interfaces/callback-response';
import { environment } from 'src/environments/environment';
import { LogCallReason } from 'src/app/common/classes/log-call-reason.class';

@Component({
    selector: 'app-page-respond',
    templateUrl: './respond.component.html',
    styleUrls: ['./respond.component.scss']
})
export class PageRespondComponent implements OnInit {

    callbackID: string;
    callReasonsToTypes: { [propKey: string]: number };
    email: string;
    gotThrough: boolean;
    details: ICallbackDetails;
    note: string;
    saving: boolean;
    completed: boolean;
    error: boolean;
    noDetails: boolean;

    constructor(
        private route: ActivatedRoute,
        private Helper: HelperService,
        private HackneyAPI: HackneyAPIService,
        private NCCAPI: NCCAPIService
    ) { }

    ngOnInit() {
        this.callbackID = this.route.snapshot.params.callbackID;
        this.email = this.route.snapshot.params.email;
        this.saving = false;

        if (this.callbackID) {
            forkJoin(
                this.NCCAPI.getCallbackDetails(this.callbackID),
                this.HackneyAPI.getCallReasons()
            )
                .pipe(take(1))
                .pipe(map((data) => {
                    return {
                        details: data[0],
                        callReasons: data[1]
                    }
                }))
                .subscribe(
                    (response) => {
                        this.details = response.details;
                        this._buildCallReasonsToTypes(response.callReasons);
                    },
                    () => { this.noDetails = true; }
                );
        } else {
            this.noDetails = true;
        }
    }

    /**
     * Build a list of call reason IDs and their corresponding call types.
     */
    private _buildCallReasonsToTypes(list) {
        this.callReasonsToTypes = {};
        Object.keys(list).forEach((key: string) => {
            list[key].forEach((row: LogCallReason) => {
                this.callReasonsToTypes[row.id] = parseInt(key, 10);
            })
        });
    }

    /**
     * Returns TRUE if we can save the callback response.
     */
    canSave(): boolean {
        if (this.saving) {
            return false;
        }

        return this.Helper.isDefined(this.gotThrough) &&
            this.Helper.isDefined(this.details) &&
            this.Helper.isPopulated(this.note);
    }

    /**
     * Saves the callback response.
     */
    saveCallbackResponse() {
        if (this.saving) {
            return;
        }

        this.saving = true;
        this.error = false;
        this.completed = false;

        const parameters: ICallbackResponse = {
            callbackId: this.callbackID,
            callReasonId: this.details.calltypereasonid,
            otherReason: this.details.calltypeotherreason,
            contactId: this.details.contactid,
            gotThrough: this.gotThrough,
            notes: this.note,
            responseBy: this.email,
            serviceRequestId: this.details.servicerequestid,
            tenancyReference: this.details.housingtagref,
            ticketNumber: this.details.ticketnumber
        };

        const responseStatus = this.gotThrough ? 'Callback successful' : 'Callback unsuccessful';
        const actionDiaryNote = `${responseStatus}; Callback response logged by ${parameters.responseBy}; ${parameters.notes}`;

        // NOTE: using forkJoin is cleaner here, but recording the callback response will fail
        // if either endpoint returns an error.
        forkJoin(
            // CRM note
            this.NCCAPI.createCallbackResponse(parameters),

            // Action Diary or UH note, depending on the call type.
            this.decideADorUH(parameters, actionDiaryNote)
        )
            .pipe(take(1))
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe(
                () => { this.completed = true; },
                () => { this.error = true; }
            );
    }

    /**
     * Returns an Observable for creating either an Action Diary or UH note, depending on the call type.
     */
    private decideADorUH(parameters: ICallbackResponse, note: string) {
        const callTypes = environment.listOfCallTypeIdsToBeSentToActionDiary;
        if (callTypes.includes(this.callReasonsToTypes[parameters.callReasonId])) {
            // Action Diary note.
            return this.NCCAPI.createActionDiaryEntry(parameters.tenancyReference, note)
        } else {
            // UH note.
            return this.NCCAPI.addTenancyAgreementNotes(parameters.tenancyReference, note, null);
        }
    }

}
