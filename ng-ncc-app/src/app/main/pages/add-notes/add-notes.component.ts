import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { take, map } from 'rxjs/operators';

import { PAGES } from '../../../common/constants/pages.constant';
import { ManageATenancyAPIService } from '../../../common/API/ManageATenancyAPI/manageatenancy-api.service';
import { CallRevisionService } from '../../../common/services/call-revision.service';
import { PageNotes } from '../abstract/notes';
import { AuthService } from '../../../common/services/auth.service';
import { BackLinkService } from '../../../common/services/back-link.service';
import { IAccountDetailsByReference } from '../../../common/interfaces/account-details-by-reference';
import { ILastCall } from '../../../common/interfaces/last-call';

@Component({
    selector: 'app-add-notes',
    templateUrl: '../view-notes/view-notes.component.html',
    styleUrls: ['../view-notes/view-notes.component.scss']
})
export class PageAddNotesComponent extends PageNotes implements OnInit {
    // This page is similar to the View Notes page, except it doesn't have a dependency on the Call service or an identified caller.

    previous_call: ILastCall;

    Auth: AuthService;
    BackLink: BackLinkService;
    CallRevision: CallRevisionService;
    ManageATenancyAPI: ManageATenancyAPIService;
    router: Router;

    constructor(private injectorObj: Injector) {
        super(injectorObj);
        this.Auth = this.injectorObj.get(AuthService);
        this.BackLink = this.injectorObj.get(BackLinkService);
        this.CallRevision = this.injectorObj.get(CallRevisionService);
        this.ManageATenancyAPI = this.injectorObj.get(ManageATenancyAPIService);
        this.router = this.injectorObj.get(Router);
    }

    ngOnInit() {
        // Are we meant to be on this page?
        this.previous_call = this.CallRevision.getPreviousCall();
        if (!this.previous_call) {
            this.router.navigate([PAGES.PREVIOUS_CALLS.route]);
            return false;
        }

        super.ngOnInit();
        this.PageTitle.set(PAGES.VIEW_NOTES.label);

        // Enable the back link and have it go to the "home" page.
        this.BackLink.enable();
        this.BackLink.setTarget(PAGES.PREVIOUS_CALLS.route);

        // Display the add note form.
        const settings = {
            agent_name: this.Auth.getFullName(),
            agent_crm_id: this.Auth.getUserID(),
            call_id: this.previous_call.servicerequestid,
            ticket_number: this.previous_call.ticketnumber,
            call_reason_id: this.previous_call.callreasonId,
            other_reason: null,
            crm_contact_id: this.previous_call.contactid,
            tenancy_reference: this.previous_call.housingref
        };
        setTimeout(() => { this.Notes.enable(this.previous_call.name, settings); }, 10);
    }

    /**
     * Returns the tenancy reference to fetch notes for.
     */
    getTenancyReference(): string {
        if (this.previous_call) {
            return this.previous_call.housingref;
        }
    }

    /**
     * Fetches a list of tenants associated with the specified tenancy reference.
     */
    getTenants(): Observable<string[]> {
        return this.ManageATenancyAPI.getAccountDetailsByReference(this.getTenancyReference())
            .pipe(take(1))
            .pipe(map((result: IAccountDetailsByReference) => {
                return result.ListOfTenants.map((tenant) => `${tenant.forename} ${tenant.surname}`);
            }));
    }

    /**
     *
     */
    isInCall(): boolean {
        return false;
    }

}
