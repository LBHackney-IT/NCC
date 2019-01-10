import { Injectable } from '@angular/core';
import { ReplaySubject, Subject, forkJoin, Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { IAddNoteParameters } from '../interfaces/add-note-parameters';
import { IJSONResponse } from '../interfaces/json-response';
import { LogCallReason } from '../classes/log-call-reason.class';

import { CALL_REASON } from '../constants/call-reason.constant';

import { NCCAPIService } from '../API/NCCAPI/ncc-api.service';
import { ViewOnlyService } from '../services/view-only.service';

@Injectable({
    providedIn: 'root'
})
export class NotesService {
    // This service controls the visibility of the add note form.
    // TODO this service should probably also be used to create automatic notes.

    CALL_REASON_IDENTIFIER = 'SUMMARY';

    _added$ = new ReplaySubject<void>();
    _position$ = new Subject<{ x: number, y: number }>();
    _name: string | null = null;
    _settings: IAddNoteParameters = null;
    _enabled: boolean;
    _visible: boolean;

    constructor(private NCCAPI: NCCAPIService, private ViewOnly: ViewOnlyService) { }

    /**
     * Attempt to enable the add note form.
     * This will fail if we don't have a tenancy reference defined (which will happen if viewing calls from an anonymous user).
     * However, we still want to be able to record automatic notes for anonymous users.
     */
    enable(name: string, settings: IAddNoteParameters) {
        if (this.ViewOnly.status) {
            // console.log('View only status; do not enable the note form.');
            this.disable();
            return;
        }

        if (settings.tenancy_reference) {
            this._enabled = true;
            this._name = name;
            this._visible = false;
        } else {
            this.disable();
        }

        this._settings = settings;
    }

    /**
     * Disable the add note form.
     */
    disable() {
        this._enabled = false;
        this._name = null;
        this._settings = null;
        this._visible = false;
    }

    toggle() {
        this._visible = !this._visible;
    }

    /**
     * Returns TRUE if the add note form is (and should be) enabled.
     */
    isEnabled(): boolean {
        return this._enabled;
    }

    /**
     * Returns TRUE if the add note form is (and should be) visible.
     */
    isVisible(): boolean {
        return this._visible;
    }

    /**
     * Returns the settings used when enabling the add note form.
     */
    getSettings(): IAddNoteParameters {
        return this._settings;
    }

    /**
     * Returns the caller/tenant name to display on the add note form.
     */
    getName(): string {
        return this._name;
    }

    /**
     * Returns an Observable representing a list of notes.
     */
    load(tenancy_reference: string) {
        return this.NCCAPI.getDiaryAndNotes(tenancy_reference);
    }

    /**
     * Record an automatic note against the call.
     * A corresponding Action Diary note is also created.
     */
    recordAutomaticNote(note_content: string): Observable<any> {
        if (this.ViewOnly.status) {
            // console.log('View only status; do not create an automatic note.');
            return of(true);
        }

        return forkJoin(

            // Automatic note...
            this.NCCAPI.createAutomaticNote({
                call_id: this._settings.call_id,
                ticket_number: this._settings.ticket_number,
                tenancy_reference: this._settings.tenancy_reference,
                call_reason_id: this._settings.call_reason_id,
                other_reason: this._settings.other_reason,
                crm_contact_id: this._settings.crm_contact_id,
                content: this._formatNoteContent(note_content)
            }),

            // Action Diary note...
            this.recordActionDiaryNote(note_content)

        )
            .pipe(map((data: IJSONResponse[]) => {
                // Inform anything subscribed to note addition events that a note was added.
                this._added$.next();

                return data[0].response.NCCInteraction;
            }));
    }

    /**
     * Record a manual note.
     * A corresponding Action Diary note is also created.
     */
    recordManualNote(note_content: string, transferred: boolean = false) {
        if (this.ViewOnly.status) {
            // console.log('View only status; do not create a manual note.');
            return of(true);
        }

        if (transferred) {
            note_content = `${note_content}\n(Transferred)`;
        }

        return forkJoin(

            // Manual note...
            this.NCCAPI.createManualNote({
                call_id: this._settings.call_id,
                ticket_number: this._settings.ticket_number,
                call_reason_id: this._settings.call_reason_id,
                other_reason: this._settings.other_reason,
                crm_contact_id: this._settings.crm_contact_id,
                content: this._formatNoteContent(note_content),
                calltransferred: transferred,
                tenancy_reference: this._settings.tenancy_reference
            }),

            // Action Diary note...
            this.recordActionDiaryNote(note_content)
        )
            .pipe(map((data: IJSONResponse[]) => {
                // Inform anything subscribed to note addition events that a note was added.
                this._added$.next();

                return data[0].response.NCCInteraction;
            }));
    }

    /**
     * Record an Action Diary entry against the tenancy associated with the call (if present).
     */
    recordActionDiaryNote(note_content: string) {
        if (this.ViewOnly.status) {
            // console.log('View only status; do not create an Action Diary note.');
            return of(true);
        }

        const tenancy_reference = this._settings.tenancy_reference;
        if (tenancy_reference) {
            const note = [];
            const reason = this._settings.other_reason ? this._settings.other_reason : 'none';

            // Add the agent's name.
            note.push(`Logged by: ${this._settings.agent_name}`);

            // Add the additional call reason, if there is one.
            note.push(`Additional reason: ${reason}`);

            // The actual message.
            // Add the caller's name to the note content (as caller information isn't saved with Action Diary notes).
            note.push(`${this._name}: ${note_content}`);

            return this.NCCAPI.createActionDiaryEntry(tenancy_reference, note.join('\n'));
        }

        return of(true);
    }

    /**
     * Record an automatic note about communications being sent.
     * A corresponding Action Diary note is also created.
     */
    recordCommsNote(notify_template_name: string, notify_method: string) {
        if (this.ViewOnly.status) {
            // console.log('View only status; do not create an automatic [comms] note.');
            return of(true);
        }

        const note_content = `${notify_template_name} comms sent by ${notify_method}.`;

        return forkJoin(

            // Automatic note...
            this.NCCAPI.createAutomaticNote({
                call_id: this._settings.call_id,
                ticket_number: this._settings.ticket_number,
                tenancy_reference: this._settings.tenancy_reference,
                call_reason_id: this._settings.call_reason_id,
                other_reason: this._settings.other_reason,
                crm_contact_id: this._settings.crm_contact_id,
                content: note_content,
                parameters: {
                    GovNotifyTemplateType: notify_template_name,
                    GovNotifyChannelType: notify_method
                }
            }),

            // Action Diary note...
            this.recordActionDiaryNote(note_content)
        );
    }

    recordCallReasons(call_reasons: LogCallReason[], other_reason: string = null) {
        // For each call reason passed to this method, create an automatic note with CALL_REASON_IDENTIFIER as the note content.

        const observables = call_reasons.map(
            (reason) => this.NCCAPI.createAutomaticNote({
                call_id: this._settings.call_id,
                ticket_number: this._settings.ticket_number,
                tenancy_reference: this._settings.tenancy_reference,
                call_reason_id: reason.id,
                other_reason: CALL_REASON.OTHER === reason.id ? other_reason : null,
                crm_contact_id: this._settings.crm_contact_id,
                content: this.CALL_REASON_IDENTIFIER
            })
        );

        return forkJoin(observables);
    }

    /**
     * Returns a Subject that is "triggered" when a note has been added.
     */
    noteWasAdded(): Subject<void> {
        return this._added$;
    }

    /**
     *
     */
    positionForm(x: number, y: number) {
        this._position$.next({ x: x, y: y });
    }

    /**
     *
     */
    updatePosition() {
        return this._position$;
    }

    /**
     * Formats note content to include a custom call reason, if present.
     */
    private _formatNoteContent(note_content: string): string {
        if (this._settings.other_reason) {
            note_content = `Other: ${this._settings.other_reason}\n${note_content}`;
        }

        return note_content;
    }

}
