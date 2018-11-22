import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { take, finalize, map } from 'rxjs/operators';

import { PAGES } from '../../constants/pages.constant';
import { CALL_REASON } from '../../constants/call-reason.constant';
import { ManageATenancyAPIService } from '../../API/ManageATenancyAPI/manageatenancy-api.service';
import { NCCAPIService } from '../../API/NCCAPI/ncc-api.service';
import { NotesService } from '../../services/notes.service';
import { CallRevisionService } from '../../services/call-revision.service';
import { PageHistory } from '../abstract/history';
import { BackLinkService } from '../../services/back-link.service';
import { PageTitleService } from '../../services/page-title.service';
import { IAccountDetailsByReference } from '../../interfaces/account-details-by-reference';
import { ILastCall } from '../../interfaces/last-call';

@Component({
    selector: 'app-add-notes',
    templateUrl: './add-notes.component.html',
    styleUrls: ['./add-notes.component.scss']
})
export class PageAddNotesComponent extends PageHistory implements OnInit {
    // This page is similar to the View Notes page, except it doesn't have a dependency on the Call service or an identified caller.
    // TODO perhaps we could reuse the View Notes page.

    previous_call: ILastCall;
    tenants_list: string[];

    // NOTES FILTER SETTINGS.
    filter_settings: {
        min_date: Date,
        max_date: Date,
        manual: { [propKey: string]: string }
    };

    filter_reason: string;
    filter_tenant: string;

    constructor(
        private router: Router,
        private BackLink: BackLinkService,
        private ManageATenancyAPI: ManageATenancyAPIService,
        private NCCAPI: NCCAPIService,
        private CallRevision: CallRevisionService,
        private PageTitle: PageTitleService,
        private Notes: NotesService
    ) {
        super();
        this.previous_call = this.CallRevision.getPreviousCall();

        // Are we meant to be on this page?
        if (!this.previous_call) {
            this.router.navigate([PAGES.PREVIOUS_CALLS.route]);
            return false;
        }
    }

    ngOnInit() {
        this.PageTitle.set(PAGES.VIEW_NOTES.label);

        // Enable the back link and have it go to the "home" page.
        this.BackLink.enable();
        this.BackLink.setTarget(PAGES.PREVIOUS_CALLS.route);

        // Set up the filter.
        this.clearFilter();

        // Generate a list of tenants.
        this.getTenants();

        // Display the add note form.
        const settings = {
            call_id: this.previous_call.servicerequestid,
            ticket_number: this.previous_call.ticketnumber,
            call_reason_id: this.previous_call.callreasonId,
            other_reason: null,
            crm_contact_id: this.previous_call.contactid,
            tenancy_reference: this.previous_call.housingref
        };
        this.Notes.enable(this.previous_call.name, settings);
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
    getTenants() {
        this.ManageATenancyAPI.getAccountDetailsByReference(this.getTenancyReference())
            .pipe(take(1))
            .subscribe((result: IAccountDetailsByReference) => {
                this.tenants_list = result.ListOfTenants.map((tenant) => `${tenant.forename} ${tenant.surname}`);
            });
    }

    /**
     * Set the manual filtering options for the list of notes.
     */
    filterNotes() {
        this.filter.manual = {
            callReasonType: this.filter_reason,
            clientName: this.filter_tenant
        };
    }

    /**
     * Clears/resets the notes filter settings.
     */
    clearFilter() {
        this.filter = {
            min_date: null,
            max_date: null,
            manual: {}
        };
        this.filter_reason = null;
        this.filter_tenant = null;
        this.filterNotes();
    }

}
