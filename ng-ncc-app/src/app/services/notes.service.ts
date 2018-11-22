import { Injectable } from '@angular/core';
import { Subject, forkJoin, of } from 'rxjs';
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

    _added$ = new Subject<void>();
    _name: string | null = null;
    _settings: IAddNoteParameters = null;
    _visible: boolean;

    constructor(private NCCAPI: NCCAPIService) { }

    /**
     * Attempt to enable the add note form.
     * This will fail if we don't have a tenancy reference defined (which will happen if viewing calls from an anonymous user).
     */
    enable(name: string, settings: IAddNoteParameters) {
        // console.log('Enable add note', name, settings);
        if (settings.tenancy_reference) {
            this._visible = true;
            this._name = name;
            this._settings = settings;
        } else {
            this.disable();
        }
    }

    /**
     * Disable the add note form.
     */
    disable() {
        this._visible = false;
        this._name = null;
        this._settings = null;
    }

    /**
     * Returns TRUE if the add note form is (and should be) enabled.
     */
    isEnabled(): boolean {
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
     * Record a manual note, with a corresponding Action Diary note.
     */
    recordManualNote(note_content: string) {
        note_content = this._formatNoteContent(note_content);
        return forkJoin(

            // Manual note...
            this.NCCAPI.createManualNote(
                this._settings.call_id,
                this._settings.ticket_number,
                this._settings.call_reason_id,
                this._settings.crm_contact_id,
                note_content
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
            // Add the caller's name to the note content (as caller information isn't saved with Action Diary notes).
            const note = `${this._name}: ${note_content}`;
            return this.NCCAPI.createActionDiaryEntry(tenancy_reference, note);
        }

        return of(true);
    }

    /**
     * Returns a Subject that is "triggered" when a note has been added.
     */
    noteWasAdded(): Subject<void> {
        return this._added$;
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
