import { environment } from '../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PAGES } from '../../constants/pages.constant';
import { ILastCall } from '../../interfaces/last-call';
import { AuthService } from '../../services/auth.service';
import { PageTitleService } from '../../services/page-title.service';
import { CallRevisionService } from '../../services/call-revision.service';
import { NotesService } from '../../services/notes.service';

@Component({
    selector: 'app-last-calls',
    templateUrl: './last-calls.component.html',
    styleUrls: ['./last-calls.component.scss']
})
export class PageLastCallsComponent implements OnInit {

    call_count: number = environment.previousCallCount;

    constructor(
        private router: Router,
        private Auth: AuthService,
        private Notes: NotesService,
        private PageTitle: PageTitleService,
        private CallRevision: CallRevisionService
    ) { }

    ngOnInit() {
        this.PageTitle.set(PAGES.PREVIOUS_CALLS.label);
        this.Notes.disable();
    }

    /**
     * Called when the agent wants to "view" a previous call.
     */
    beginAddNotes(row: ILastCall) {
        this.CallRevision.setPreviousCall(row);
        this.router.navigate([PAGES.ADD_NOTES.route]);
    }

    /**
     * Returns TRUE if the agent is a team leader.
     */
    isTeamLeader(): boolean {
        return this.Auth.isTeamLeader();
    }


}
