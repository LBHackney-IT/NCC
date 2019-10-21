import { environment } from '../../../../environments/environment';
import { CharacterCount } from 'govuk-frontend';

import { Component, HostBinding, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { finalize, take, takeUntil } from 'rxjs/operators';

import { WindowService } from 'src/app/common/services/window.service';
import { NotesService } from 'src/app/common/services/notes.service';
import { HelperService } from 'src/app/common/services/helper.service';

import { PAGES } from 'src/app/common/constants/pages.constant';

import { ILogCallSelection } from 'src/app/common/interfaces/log-call-selection';
import { IAddNoteParameters } from 'src/app/common/interfaces/add-note-parameters';
import { CallNatureComponent } from '../call-nature/call-nature.component';


@Component({
    selector: 'app-note-form',
    templateUrl: './note-form.component.html',
    styleUrls: ['./note-form.component.scss']
})
export class NoteFormComponent implements OnInit, OnDestroy {
    @HostBinding('style.left.px') x: number;
    @HostBinding('style.top.px') y: number;

    @ViewChild('commentForm') commentForm: ElementRef;
    @ViewChild('commentField') commentField: ElementRef;
    @ViewChild('callNatureField') callNatureField: CallNatureComponent;
    @ViewChild('characterCount') input;

    private _destroyed$ = new Subject();

    TOP_MARGIN = 20;        // gap (in pixels) between the top of the content area and the toggle button.
    FORM_GAP = 20;

    page_defs = PAGES;

    containerStyle: Object; // used to control the inline style of .note-form__container.
    comment: string;
    saving: boolean;        // set to TRUE when saving a note.
    call_nature: ILogCallSelection;  // the selected call type and reason.
    show: boolean;          // whether the note component is visible on the page.
    expanded: boolean;      // whether the form for adding a note is expanded.
    isMinimised: boolean;
    settings: IAddNoteParameters;
    transferred: boolean;
    savedProblem: boolean;         // set to TRUE if there was a problem with saving a note.
    savedSuccess: boolean;         // set to TRUE if a note was saved successfully.
    characterCount: any;
    characterError: boolean;
    maxLength = 1800;

    constructor(
        private element: ElementRef,
        private Helper: HelperService,
        private Notes: NotesService,
        private Window: WindowService
    ) { }

    ngOnInit() {
        this.expanded = false;
        this._resetComment();

        // Adjust the position of the add note form so it remains within the browser window.
        this.Notes.updatePosition()
            .pipe(takeUntil(this._destroyed$))
            .subscribe((coords: { x: number, y: number }) => {
                this.x = coords.x;

                // We want to position the form so it is visible within the viewport.
                const el = this.element.nativeElement;
                const wh = this.Window.nativeWindow.innerHeight;

                if ((coords.y + el.clientHeight) > wh) {
                    this.y = wh - el.clientHeight - this.FORM_GAP;
                } else {
                    this.y = coords.y;
                }
            });

        // Subscribe to notes settings updates.
        this.Notes.getSettings
            .pipe(takeUntil(this._destroyed$))
            .subscribe((settings: IAddNoteParameters) => {
                this.settings = settings;
            });
        this.Notes.toggled.subscribe(
            (data: boolean) => {
                if (data) {
                    if (this.input) {
                        this.characterCount = new CharacterCount(this.input.nativeElement);
                        this.characterCount.init();
                    }
                }
            });
    }

    ngOnDestroy() {
        this._destroyed$.next();
    }

    /**
     * Returns TRUE if the component should be made visible.
     */
    shouldShow(): boolean {
        // The component should be visible if:
        // - we have a call type and reason selected;
        // - we have a caller selected;
        // - the caller is NOT anonymous.
        // Because we have a CRM contact ID representing an anonymous caller, it's possible to record notes for them.
        // However, it was mentioned that anonymous callers should only have "automatic" notes.
        return this.Notes.isVisible();
    }

    /**
     * Show or hide the note form.
     */
    toggle() {
        this.Notes.toggle();

        if (this.Notes.isVisible()) {
            this.openForm();
        } else {
            this.closeForm();
        }
    }

    /**
     *
     */
    openForm() {
        this.Notes.show();
        this.restore();
        // Set the focus on the comment field if the form is visible.
        // The timeout is necessary because the field isn't immediately visible (and therefore not focusable).
        setTimeout(() => { this.commentField.nativeElement.focus(); }, 1);
    }

    /**
     *
     */
    closeForm(reset: boolean = false) {
        if (reset) {
            this._resetComment();
        }
        this.restore();
        this.Notes.hide();
    }

    /**
     * Returns TRUE if the caller is a non-tenant.
     */
    isCallerNonTenant(): boolean {
        return this.settings && environment.nonTenantUserID === this.settings.crm_contact_id;
    }

    /**
     * Returns the caller's name.
     */
    getCallerName(): string {
        const name = this.Notes.getName();
        return name ? name : 'anonymous';
        // return this.Call.getCaller().getName();
    }

    /**
     *
     */
    getTenancyReference(): string {
        return this.settings && this.settings.tenancy_reference;
    }

    /**
     * Reposition the button and form at the specified scroll position.
     * Using only CSS, the component would appear over the vertical scrollbar (if there is one) if its position is fixed.
     * We have to listen to the scroll event on the main content container, so we can position the component accordingly.
     */
    _reposition(scroll_position: number) {
        this.containerStyle = {
            'top.px': scroll_position + this.TOP_MARGIN
            // a nice shortcut for setting a pixel value.
        };
    }

    /**
     * Returns TRUE if we have enough information to save a note.
     */
    canSaveNote(): boolean {
        const is_saving = this.saving;
        const has_comment = this.comment && this.comment.trim().length > 0;
        const has_call_id = !!(this.settings && this.settings.call_id);
        const has_call_nature = this.isCallNatureSelected();
        const is_too_long = this.characterError;

        return !is_saving && (has_comment && has_call_id && has_call_nature && !is_too_long);
    }

    /**
     *
     */
    updateNoteProgress() {
        const has_comment = this.comment && this.comment.trim().length > 0;
        this.Notes.isInProgress = has_comment;
        const remainingNumber = this.maxLength - this.comment.trim().length;
        this.characterError = remainingNumber < 0;
    }

    /**
     * This is called when the form is submitted.
     * Here we save a manual note.
     */
    saveNote() {
        if (this.canSaveNote()) {
            this.savedProblem = false;
            this.savedSuccess = false;
            this.saving = true;

            this.Notes.recordManualNote(this.call_nature, this.comment, this.transferred)
                .pipe(take(1))
                .pipe(finalize(() => {
                    this.saving = false;
                }))
                .subscribe(
                    () => {
                        // Display a confirmation that the note was saved.
                        // this.savedSuccess = true;

                        // Reset just the comment (we might want to keep the selected call type and reason).
                        this.comment = null;
                        this.Notes.isInProgress = false;

                        this.closeForm(true);
                    },
                    () => {
                        // An error occurred.
                        this.savedProblem = true;
                    }
                );
        }
    }

    /**
     * Cancels the addition of a note.
     * This will reset the form and close the add note form.
     */
    cancelNote() {
        this.closeForm(true);
    }

    /**
     * Simply reset the form.
     */
    _resetComment() {
        this.call_nature = null;
        this.comment = null;
        this.savedSuccess = false;
        this.savedProblem = false;
        this.transferred = false;

        if (this.callNatureField) {
            this.callNatureField.reset();
        }

        this.Notes.isInProgress = false;
    }

    /**
     *
     */
    selectedCallNature(selection: ILogCallSelection) {
        this.call_nature = selection;
    }

    /**
     * Returns TRUE if a call type and reason are selected.
     */
    isCallNatureSelected(): boolean {
        if (this.Helper.isDefined(this.call_nature)) {
            if (this.Helper.isDefined(this.call_nature.call_reason)) {
                return ('Other' !== this.call_nature.call_reason.label) || this.Helper.isPopulated(this.call_nature.other_reason);
            }
        }
        return false;
    }

    /**
     * Minimise the add note form.
     */
    minimise() {
        this.isMinimised = true;
    }

    /**
     * Restore the add note form, i.e. bring it out of miniminsation.
     */
    restore() {
        this.isMinimised = false;
    }
}
