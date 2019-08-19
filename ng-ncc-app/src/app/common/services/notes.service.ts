import { Injectable } from '@angular/core';
import { ReplaySubject, Subject, forkJoin, Observable, of, iif, ObservableInput } from 'rxjs';
import { map } from 'rxjs/operators';

import { IAddNoteParameters } from '../../common/interfaces/add-note-parameters';
import { IJSONResponse } from '../../common/interfaces/json-response';
import { ICallbackNoteParameters } from '../../common/interfaces/callback-note-parameters';
import { ILogCallSelection } from '../../common/interfaces/log-call-selection';

import { NCCAPIService } from '../../common/API/NCCAPI/ncc-api.service';
import { ViewOnlyService } from '../services/view-only.service';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
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
    private _isInProgress: boolean;
    _visible: boolean;
    _usedNatures: ILogCallSelection[]; // previously used call natures.

    public getSettings = new ReplaySubject<IAddNoteParameters>();
    public whenEnabled = new Subject<void>();
    public whenShown = new Subject<void>();
    public toggled = new Subject<boolean>();

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

        this._name = name;
        this._visible = false;
        this._usedNatures = [];
        this._settings = settings;

        this.getSettings.next(settings);

        // Only enable the notes form if we have a tenancy refernece.
        if (settings.tenancy_reference) {
            this._enabled = true;
            this.whenEnabled.next();
            this.toggled.next(true);
        }

    }

    /**
     * Disable the add note form.
     */
    disable() {
        this._enabled = false;
        this._name = null;
        this._usedNatures = [];
        this._visible = false;
        this._settings = null;

        this.getSettings.next(this._settings);
        this.toggled.next(false);
    }

    show() {
        this._visible = true;
        this.whenShown.next();
    }

    hide() {
        this._visible = false;
    }

    toggle() {
        if (this._visible) {
            this.hide();
        } else {
            this.show();
        }
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
                call_reason_id: call_nature ? call_nature.call_reason.id : null,
                other_reason: call_nature ? call_nature.other_reason : null,
                crm_contact_id: this._settings.crm_contact_id,
                content: this._formatNoteContent(note_content, call_nature)
            }),

            this.checkCallTypeAndMakeCall(call_nature, note_content)

        )
            .pipe(map((data: IJSONResponse[]) => {
                // Inform anything subscribed to note addition events that a note was added.
                this._added$.next();

                return data[0].response.NCCInteraction;
            }));
    }

    /**
     * Record a manual note.
     * A corresponding Action Diary or Universal Housing note is also created.
     */
    recordManualNote(call_nature: ILogCallSelection, note_content: string, transferred: boolean = false) {
        if (this.ViewOnly.status) {
            // console.log('View only status; do not create a manual note.');
            return of(true);
        }

        if (transferred) {
            note_content = `${note_content}\n(Transferred)`;
        }

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

            // Action Diary or Universal Housing note...
            this.checkCallTypeAndMakeCall(call_nature, note_content)


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
    recordActionDiaryNote(note_content: string | null, call_nature: ILogCallSelection = null) {
        if (this.ViewOnly.status) {
            // console.log('View only status; do not create an Action Diary note.');
            return of(true);
        }

        const tenancy_reference = this._settings.tenancy_reference;
        if (tenancy_reference) {
            return this.NCCAPI.createActionDiaryEntry(tenancy_reference, note_content);
        }

        return of(true);
    }

    recordTenancyAgreementNote(note_content: string | null, call_nature: ILogCallSelection = null) {

        if (this.ViewOnly.status) {
            // console.log('View only status; do not create an Action Diary note.');
            return of(true);
        }
        const username: string = this.authService.getUsername();
        const tenancy_reference = this._settings.tenancy_reference;
        if (tenancy_reference && username) {
            return this.NCCAPI.addTenancyAgreementNotes(tenancy_reference, note_content, username);

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
    recordCallbackNote(call_nature: ILogCallSelection = null, details: ICallbackNoteParameters): Observable<any> {
        if (this.ViewOnly.status) {
            // console.log('View only status; do not create an automatic note.');
            return of(true);
        }

        // Remove any empty email addresses.
        const emails = [details.recipientEmail, details.managerEmail].filter(e => null !== e);

        // The callback request is considered sent to the first specified email address,
        // with any other email addresses being carbon copied (CC'd).
        let noteMessage = `Callback request sent to: ${emails[0]}`;
        if (emails[1]) {
            noteMessage += `; CC'd to: ${emails[1]}`;
        }
        noteMessage += `; Message: ${details.message}`;

        return forkJoin(

            // Callback note...
            this.NCCAPI.createCallbackNote(this._settings.agent_crm_id, {
                call_id: this._settings.call_id,
                ticket_number: this._settings.ticket_number,
                tenancy_reference: this._settings.tenancy_reference,
                call_reason_id: call_nature.call_reason.id,
                other_reason: call_nature.other_reason,
                crm_contact_id: this._settings.crm_contact_id,
                content: noteMessage
            }, details),

            // Action Diary note...
            this.checkCallTypeAndMakeCall(call_nature, noteMessage, 'Callback Request')
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
    recordCallReasons(callReasonNotes: ILogCallSelection[]) {
        // For each call reason, create an automatic note with CALL_REASON_IDENTIFIER as the note content.
        const observables = callReasonNotes.map(
            (logCallSelection: ILogCallSelection) => {
                return this.recordAutomaticNote(
                    `Caller identified as ${this._name}.`,
                    logCallSelection
                );
            }
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
        this._usedNatures.push({ ...call_nature });
    }

    /**
     *
     */
    getUsedCallNatures() {
        return this._usedNatures;
    }

    /**
     * This function builds
     * @private
     * @memberof NotesService
     */
    private buildNoteText = (call_nature: ILogCallSelection = null,
        additional_notes: string = null,
        note_header: string = 'Call Summary'): string => {

        const note = [];
        note.push(note_header);
        // Add callers name
        note.push('Caller: ' + this._name);
        // Add the agent's name.
        note.push(`Logged by: ${this._settings.agent_name}`);
        // Add types and reasons if not null
        if (call_nature !== null) {
            !call_nature.other_reason ?
                note.push(call_nature.call_type.label + ': ' + call_nature.call_reason.label) :
                note.push(
                    call_nature.call_type.label +
                    ': ' +
                    call_nature.call_reason.label +
                    ' (' +
                    call_nature.other_reason +
                    ')'
                );
        }

        if (additional_notes) {
            note.push(additional_notes);
        }
        return note.join('; ');
    }

    /**
     * Check whether it needs to call Action Diary or Universal housing
     * depending on the type.
     * Then make the appropiate api call
     *
     * @private
     * @memberof NotesService
     */
    private checkCallTypeAndMakeCall = (call_nature: ILogCallSelection,
        additional_notes: string,
        note_header?: string): ObservableInput<any> => {

        const callTypes = environment.listOfCallTypeIdsToBeSentToActionDiary;

        if (call_nature && call_nature.call_type !== null) {
            const note = note_header ?
                this.buildNoteText(call_nature, additional_notes, note_header) :
                this.buildNoteText(call_nature, additional_notes);

            if (callTypes.includes(call_nature.call_type.id)) {
                return this.recordActionDiaryNote(note, call_nature);
            } else {
                return this.recordTenancyAgreementNote(note, call_nature);
            }
        } else {
            return of({});
        }
    }

    set isInProgress(value: boolean) {
        this._isInProgress = value;
    }

    get isInProgress(): boolean {
        return this._isInProgress;
    }

}
