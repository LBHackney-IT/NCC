import { Injectable } from '@angular/core';
import { ReplaySubject, Subject, forkJoin, of } from 'rxjs';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { IAddNoteParameters } from '../interfaces/add-note-parameters';
import { IJSONResponse } from '../interfaces/json-response';
import { NCCAPIService } from '../API/NCCAPI/ncc-api.service';

@Injectable({
    providedIn: 'root'
})
export class NotesService {
    // This service controls the visibility of the add note form.
    // TODO this service should probably also be used to create automatic notes.

    _added$ = new ReplaySubject<void>();
    _position$ = new Subject<{ x: number, y: number }>();
    _name: string | null = null;
    _settings: IAddNoteParameters = null;
    _enabled: boolean;
    _visible: boolean;

    constructor(private NCCAPI: NCCAPIService) { }

    /**
     * Attempt to enable the add note form.
     * This will fail if we don't have a tenancy reference defined (which will happen if viewing calls from an anonymous user).
     * However, we still want to be able to record automatic notes for anonymous users.
     */
    enable(name: string, settings: IAddNoteParameters) {
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
        return forkJoin(

            // Automatic note...
            this.NCCAPI.createAutomaticNote(
                this._settings.call_id,
                this._settings.ticket_number,
                this._settings.tenancy_reference,
                this._settings.call_reason_id,
                this._settings.crm_contact_id,
                this._formatNoteContent(note_content)
            ),

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
    recordManualNote(note_content: string) {
        return forkJoin(

            // Manual note...
            this.NCCAPI.createManualNote(
                this._settings.call_id,
                this._settings.ticket_number,
                this._settings.call_reason_id,
                this._settings.crm_contact_id,
                this._formatNoteContent(note_content)
            ),

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
        const note_content = `${notify_template_name} comms sent by ${notify_method}.`;

        return forkJoin(

            // Automatic note...
            this.NCCAPI.createAutomaticNote(
                this._settings.call_id,
                this._settings.ticket_number,
                this._settings.tenancy_reference,
                this._settings.call_reason_id,
                this._settings.crm_contact_id,
                note_content,
                {
                    GovNotifyTemplateType: notify_template_name,
                    GovNotifyChannelType: notify_method
                }
            ),

            // Action Diary note...
            this.recordActionDiaryNote(note_content)
        );
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
