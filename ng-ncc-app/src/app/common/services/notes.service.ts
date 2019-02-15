import { Injectable } from '@angular/core';
import { ReplaySubject, Subject, forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { IAddNoteParameters } from '../../common/interfaces/add-note-parameters';
import { IJSONResponse } from '../../common/interfaces/json-response';
import { ICallbackNoteParameters } from '../../common/interfaces/callback-note-parameters';
import { ILogCallSelection } from '../../common/interfaces/log-call-selection';
import { ICallReasonNote } from '../../common/interfaces/call-reason-note';

import { NCCAPIService } from '../../common/API/NCCAPI/ncc-api.service';
import { ViewOnlyService } from '../services/view-only.service';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class NotesService {
    // This service controls the visibility of the add note form.
    // TODO this service should probably also be used to create automatic notes.

    CALL_REASON_IDENTIFIER = 'Call Summary';

    _added$ = new ReplaySubject<void>();
    _position$ = new Subject<{ x: number, y: number }>();
    _name: string | null = null;
    _settings: IAddNoteParameters = null;
    _enabled: boolean;
    _visible: boolean;
    _usedNatures: ILogCallSelection[]; // previously used call natures.

    constructor(private NCCAPI: NCCAPIService, private ViewOnly: ViewOnlyService, private authService: AuthService) { }

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

        this._usedNatures = [];
        this._settings = settings;
    }

    /**
     * Disable the add note form.
     */
    disable() {
        this._enabled = false;
        this._name = null;
        this._usedNatures = [];
        this._settings = null;
        this._visible = false;
    }

    show() {
        this._visible = true;
    }

    hide() {
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
    recordAutomaticNote(note_content: string, call_nature: ILogCallSelection = null): Observable<any> {
        if (this.ViewOnly.status) {
            // console.log('View only status; do not create an automatic note.');
            return of(true);
        }

        return forkJoin(

            // Automatic note...
            this.NCCAPI.createAutomaticNote(this._settings.agent_crm_id, {
                call_id: this._settings.call_id,
                ticket_number: this._settings.ticket_number,
                tenancy_reference: this._settings.tenancy_reference,
                call_reason_id: null,
                other_reason: null,
                crm_contact_id: this._settings.crm_contact_id,
                content: this._formatNoteContent(note_content, call_nature)
            }),

            // Action Diary note...
            this.recordActionDiaryNote(note_content, call_nature)

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
    recordManualNote(call_nature: ILogCallSelection, note_content: string, transferred: boolean = false) {
        if (this.ViewOnly.status) {
            // console.log('View only status; do not create a manual note.');
            return of(true);
        }

        if (transferred) {
            note_content = `${note_content}\n(Transferred)`;
        }

        const callTypes = ['Rent', 'Leasehold Services'];
        const callType = call_nature.call_type.label;

        return forkJoin(

            // Manual note...
            this.NCCAPI.createManualNote(this._settings.agent_crm_id, {
                call_id: this._settings.call_id,
                ticket_number: this._settings.ticket_number,
                call_reason_id: call_nature.call_reason.id,
                other_reason: call_nature.other_reason,
                crm_contact_id: this._settings.crm_contact_id,
                content: this._formatNoteContent(note_content, call_nature),
                calltransferred: transferred,
                tenancy_reference: this._settings.tenancy_reference
            }),



            // Action Diary note...
            // recordNote(note_content, call_nature)
            callTypes.includes(callType) ?
                this.recordActionDiaryNote(note_content, call_nature) :
                this.recordTenancyAgreementNote(note_content, call_nature)
            //  this.recordActionDiaryNote(note_content)
        )
            .pipe(map((data: IJSONResponse[]) => {
                // Add the call nature to the list.
                this._addCallNatureToList(call_nature);

                // Inform anything subscribed to note addition events that a note was added.
                this._added$.next();

                return data[0].response.NCCInteraction;
            }));
    }

    /**
     * Record an Action Diary entry against the tenancy associated with the call (if present).
     */
    recordActionDiaryNote(note_content: string, call_nature: ILogCallSelection = null) {
        if (this.ViewOnly.status) {
            // console.log('View only status; do not create an Action Diary note.');
            return of(true);
        }

        const tenancy_reference = this._settings.tenancy_reference;
        if (tenancy_reference) {
            const note = [];
            const reason = (call_nature && call_nature.other_reason) ? call_nature.other_reason : null;

            // Add the agent's name.
            note.push(`Logged by: ${this._settings.agent_name}`);

            // Add the additional call reason, if there is one.
            if ( reason ) {
                note.push(`Additional reason: ${reason}`);
            }

            // The actual message.
            // Add the caller's name to the note content (as caller information isn't saved with Action Diary notes).
            note.push(`${this._name}: ${note_content}`);

            return this.NCCAPI.createActionDiaryEntry(tenancy_reference, note.join('\n'));
        }

        return of(true);
    }

    /**
     *
     *
     * @param {string} note_content
     * @param {ILogCallSelection} [call_nature=null]
     * @returns
     * @memberof NotesService
     */
    recordTenancyAgreementNote(note_content: string, call_nature: ILogCallSelection = null) {
        if (this.ViewOnly.status) {
            // console.log('View only status; do not create an Action Diary note.');
            return of(true);
        }
        const username: string = this.authService.getUsername();
        const tenancy_reference = this._settings.tenancy_reference;
        if (tenancy_reference && username) {
            const note = [];
            const reason = (call_nature && call_nature.other_reason) ? call_nature.other_reason : null;

            // Add the agent's name.
            note.push(`Logged by: ${this._settings.agent_name}`);

            // Add the additional call reason, if there is one.
            if (reason) {
                note.push(`Additional reason: ${reason}`);
            }

            // The actual message.
            // Add the caller's name to the note content (as caller information isn't saved with Action Diary notes).
            note.push(`${this._name}: ${note_content}`);
            return this.NCCAPI.addTenancyAgreementNotes(tenancy_reference, note.join('\n'), username);
        }

        return of(true);
    }

    /**
     * Record an automatic note about communications being sent.
     * A corresponding Action Diary note is also created.
     */
    recordCommsNote(notify_template_name: string, notify_method: string, call_nature: ILogCallSelection = null) {
        if (this.ViewOnly.status) {
            // console.log('View only status; do not create an automatic [comms] note.');
            return of(true);
        }

        const note_content = `${notify_template_name} comms sent by ${notify_method}.`;

        return forkJoin(

            // Automatic note...
            this.NCCAPI.createAutomaticNote(this._settings.agent_crm_id, {
                call_id: this._settings.call_id,
                ticket_number: this._settings.ticket_number,
                tenancy_reference: this._settings.tenancy_reference,
                call_reason_id: null,
                other_reason: null,
                crm_contact_id: this._settings.crm_contact_id,
                content: note_content,
                parameters: {
                    GovNotifyTemplateType: notify_template_name,
                    GovNotifyChannelType: notify_method
                }
            }),

            // Action Diary note...
            this.recordActionDiaryNote(note_content, call_nature)
        );
    }

    /**
     * Record a callback note against the call.
     * A corresponding Action Diary note is also created.
     */
    recordCallbackNote(note_content: string, call_nature: ILogCallSelection = null, details: ICallbackNoteParameters): Observable<any> {
        if (this.ViewOnly.status) {
            // console.log('View only status; do not create an automatic note.');
            return of(true);
        }

        return forkJoin(

            // Callback note...
            this.NCCAPI.createCallbackNote(this._settings.agent_crm_id, {
                call_id: this._settings.call_id,
                ticket_number: this._settings.ticket_number,
                tenancy_reference: this._settings.tenancy_reference,
                call_reason_id: call_nature.call_reason.id,
                other_reason: call_nature.other_reason,
                crm_contact_id: this._settings.crm_contact_id,
                content: this._formatNoteContent(note_content, call_nature)
            }, details),

            // Action Diary note...
            this.recordActionDiaryNote(note_content, call_nature)
        )
            .pipe(map((data: IJSONResponse[]) => {
                // Inform anything subscribed to note addition events that a note was added.
                this._added$.next();

                return data[0].response.NCCInteraction;
            }));
    }

    /**
     * Record a series of automatic notes representing call reasons.
     */
    recordCallReasons(callReasonNotes: ICallReasonNote[]) {
        // For each call reason, create an automatic note with CALL_REASON_IDENTIFIER as the note content.
        const observables = callReasonNotes.map(
            (note: ICallReasonNote) => this.NCCAPI.createAutomaticNote(
                this._settings.agent_crm_id,
                {
                    call_id: this._settings.call_id,
                    ticket_number: this._settings.ticket_number,
                    tenancy_reference: this._settings.tenancy_reference,
                    call_reason_id: note.callReasonId,
                    other_reason: note.otherReason,
                    crm_contact_id: this._settings.crm_contact_id,
                    content: this.CALL_REASON_IDENTIFIER
                }
            )
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
    private _formatNoteContent(note_content: string, call_nature: ILogCallSelection = null): string {
        if (call_nature && call_nature.other_reason) {
            note_content = `Other: ${call_nature.other_reason}\n${note_content}`;
        }

        return note_content;
    }

    /**
     *
     */
    private _addCallNatureToList(call_nature: ILogCallSelection) {
        this._usedNatures.push(call_nature);
    }

    /**
     *
     */
    getUsedCallNatures() {
        return this._usedNatures;
    }

}
