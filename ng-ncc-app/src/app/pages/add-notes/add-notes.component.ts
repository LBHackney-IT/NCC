import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { take, finalize } from 'rxjs/operators';

import { PAGES } from '../../constants/pages.constant';
import { CALL_REASON } from '../../constants/call-reason.constant';
import { NCCAPIService } from '../../API/NCCAPI/ncc-api.service';
import { CallRevisionService } from '../../services/call-revision.service';
import { PageHistory } from '../abstract/history';
import { BackLinkService } from '../../services/back-link.service';
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
    error: boolean;
    note: string;
    refresh: string;
    saving: boolean;

    constructor(
        private router: Router,
        private BackLink: BackLinkService,
        private NCCAPI: NCCAPIService,
        private CallRevision: CallRevisionService,
        private PageTitle: PageTitleService
    ) {
        super();

        // Make sure we have a previous call, otherwise go to the "home" page.
        this.previous_call = this.CallRevision.getPreviousCall();
        if (!this.previous_call) {
            this.router.navigate([PAGES.PREVIOUS_CALLS.route]);
        }
    }

    ngOnInit() {
        this.PageTitle.set(PAGES.VIEW_NOTES.label);

        // Enable the back link and have it go to the "home" page.
        this.BackLink.enable();
        this.BackLink.setTarget(PAGES.PREVIOUS_CALLS.route);
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
     * Returns TRUE if the agent can save a new note.
     */
    canSaveNote(): boolean {
        return !this.saving && this.note && (this.note.length > 0);
    }

    /**
     * Saves a new note.
     */
    saveNote(event) {
        if (this.saving || (event && event.defaultPrevented)) {
            return;
        }

        this.saving = true;
        this.error = false;

        const note_content = this._formatNoteContent(this.note);

        forkJoin(
            this._saveManualNote(note_content), // Manual note
            this._saveActionDiaryNote(note_content) // Action Diary note
        )
            .pipe(take(1))
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe(
                () => {
                    this.note = null;

                    // Update the list of notes.
                    // It doesn't matter what we set refresh to, as long as it has a different value than before.
                    const now = new Date();
                    this.refresh = now.toDateString();
                },
                () => { this.error = true; },
        );
    }

    /**
     * Saves a new note.
     */
    private _saveManualNote(note_content: string) {
        return this.NCCAPI.createManualNote(
            this.previous_call.servicerequestid,
            this.previous_call.ticketnumber,
            this.previous_call.callreasonId,
            this.previous_call.contactid,
            note_content
        );
    }

    /**
     * Saves a new note.
     */
    private _saveActionDiaryNote(note_content: string) {
        const note = `${this.previous_call.name}: ${note_content}`;
        return this.NCCAPI.createActionDiaryEntry(this.previous_call.housingref, note);
    }

    /**
     *
     */
    private _formatNoteContent(note_content: string): string {
        if (CALL_REASON.OTHER === this.previous_call.callreasonId) {
            note_content = `Other: ${this.previous_call.callreasonId}\n${note_content}`;
        }

        return note_content;
    }

}