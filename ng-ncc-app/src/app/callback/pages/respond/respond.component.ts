import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { finalize, take } from 'rxjs/operators';

import { NCCAPIService } from '../../../common/API/NCCAPI/ncc-api.service';
import { HelperService } from '../../../common/services/helper.service';
import { ICallbackDetails } from '../../../common/interfaces/callback-details';
import { ICallbackResponse } from '../../../common/interfaces/callback-response';

@Component({
    selector: 'app-page-respond',
    templateUrl: './respond.component.html',
    styleUrls: ['./respond.component.scss']
})
export class PageRespondComponent implements OnInit {

    callbackID: string;
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
        private NCCAPI: NCCAPIService
    ) { }

    ngOnInit() {
        this.callbackID = this.route.snapshot.params.callbackID;
        this.email = this.route.snapshot.params.email;
        this.saving = false;

        if (this.callbackID) {
            this.NCCAPI.getCallbackDetails(this.callbackID)
                .pipe(take(1))
                .subscribe(
                    (response) => { this.details = response; },
                    (error) => { this.noDetails = true; }
                );
        } else {
            this.noDetails = true;
        }
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

        const actionDiaryNote = `Callback response logged by ${parameters.responseBy}\n${parameters.notes}`;

        // NOTE: using forkJoin is cleaner here, but recording the callback response will fail
        // if either endpoint returns an error.
        forkJoin(
            // CRM note
            this.NCCAPI.createCallbackResponse(parameters),

            // Action Diary note
            this.NCCAPI.createActionDiaryEntry(parameters.tenancyReference, actionDiaryNote)
        )
            .pipe(take(1))
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe(
                () => { this.completed = true; },
                () => { this.error = true; }
            );
    }
}
