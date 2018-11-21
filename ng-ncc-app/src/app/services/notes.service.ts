import { Injectable } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { IAddNoteParameters } from '../interfaces/add-note-parameters';
import { IJSONResponse } from '../interfaces/json-response';
import { NCCAPIService } from '../API/NCCAPI/ncc-api.service';

@Injectable({
    providedIn: 'root'
})
export class NotesService {
    // This service controls the visibility of the add note form.
    // TODO this service should probably also be used to create notes.

    _name: string | null = null;
    _settings: IAddNoteParameters = null;
    _visible: boolean;

    constructor(private NCCAPI: NCCAPIService) { }

    enable(name: string, settings: IAddNoteParameters) {
        console.log('Enable add note', name, settings);
        this._visible = true;
        this._name = name;
        this._settings = settings;
    }

    disable() {
        this._visible = false;
        this._name = null;
        this._settings = null;
    }

    isEnabled(): boolean {
        return this._visible;
    }

    getSettings(): IAddNoteParameters {
        return this._settings;
    }

    getName(): string {
        return this._name;
    }

    /**
     * Record a manual note against the call, with a corresponding Action Diary note.
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
            .pipe(map((data: IJSONResponse[]) => data[0].response.NCCInteraction));
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
     * Formats note content to include a custom call reason, if present.
     */
    private _formatNoteContent(note_content: string): string {
        if (this._settings.other_reason) {
            note_content = `Other: ${this._settings.other_reason}\n${note_content}`;
        }

        return note_content;
    }

}
