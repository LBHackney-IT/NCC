import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PAGES } from '../../constants/pages.constant';
import { CallRevisionService } from '../../services/call-revision.service';
import { PageHistory } from '../abstract/history';
import { PageTitleService } from '../../services/page-title.service';
import { ILastCall } from '../../interfaces/last-call';

@Component({
    selector: 'app-add-notes',
    templateUrl: './add-notes.component.html',
    styleUrls: ['./add-notes.component.scss']
})
export class PageAddNotesComponent extends PageHistory implements OnInit {
    // This page is similar to the View Notes page, except it doesn't have a dependency on the Call service or an identified caller.

    previous_call: ILastCall;

    constructor(
        private router: Router,
        private CallRevision: CallRevisionService,
        private PageTitle: PageTitleService
    ) {
        super();
        this.previous_call = this.CallRevision.getPreviousCall();
        if (!this.previous_call) {
            this.router.navigate([PAGES.PREVIOUS_CALLS.route]);
        }
    }

    ngOnInit() {
        // Make sure we have a previous call, otherwise go to the "home" page.
        this.PageTitle.set(PAGES.VIEW_NOTES.label);
    }

    /**
     * Returns the tenancy reference to fetch notes for.
     */
    getTenancyReference(): string {
        if (this.previous_call) {
            return this.previous_call.housingref;
        }
    }

}
