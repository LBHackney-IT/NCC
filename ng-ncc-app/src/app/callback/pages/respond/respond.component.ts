import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize, take } from 'rxjs/operators';

import { CALLBACK_SUCCESS } from '../../../common/constants/callback-success.constant';
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
        this.gotThrough = CALLBACK_SUCCESS.YES === parseInt(this.route.snapshot.params.gotThrough, 10);
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
     *
     */
    canSave(): boolean {
        return !this.saving && this.Helper.isDefined(this.details) && this.Helper.isPopulated(this.note);
    }

    /**
     *
     */
    saveCallbackResponse() {
        if (this.saving) {
            return;
        }

        this.saving = true;
        this.error = false;

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

        this.NCCAPI.createCallbackResponse(parameters)
            .pipe(take(1))
            .pipe(finalize(() => {
                this.saving = false;
            }))
            .subscribe(
                () => { this.completed = true; },
                () => { this.error = true; }
            );
    }
}
