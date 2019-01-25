import { environment } from '../../../../environments/environment';

import { Component, HostBinding, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { finalize, take, takeUntil } from 'rxjs/operators';

import { ContentAreaComponent } from '../../../common/layout/content-area/content-area.component';

import { CallService } from '../../services/call.service';
import { WindowService } from '../../services/window.service';
import { NotesService } from '../../services/notes.service';

import { CALL_REASON } from '../../constants/call-reason.constant';
import { PAGES } from '../../constants/pages.constant';

import { IAddNoteParameters } from '../../interfaces/add-note-parameters';
import { ILogCallSelection } from '../../interfaces/log-call-selection';
import { LogCallReason } from '../../classes/log-call-reason.class';
import { LogCallType } from '../../classes/log-call-type.class';


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

    private _destroyed$ = new Subject();

    TOP_MARGIN = 20;        // gap (in pixels) between the top of the content area and the toggle button.
    FORM_GAP = 20;

    page_defs = PAGES;

    containerStyle: Object; // used to control the inline style of .note-form__container.
    comment: string = null;
    saving: boolean;        // set to TRUE when saving a note.
    call_nature: ILogCallSelection;  // the selected call type and reason.
    show: boolean;          // whether the note component is visible on the page.
    error: boolean;         // set to TRUE if there was a problem with saving a note.
    expanded: boolean;      // whether the form for adding a note is expanded.
    transferred = false;

    constructor(
        private element: ElementRef,
        private router: Router,
        private Call: CallService,
        private Notes: NotesService,
        private Window: WindowService
    ) { }

    ngOnInit() {
        this.expanded = false;
        this._resetComment();

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
            // Set the focus on the comment field if the form is visible.
            // The timeout is necessary because the field isn't immediately visible (and therefore not focusable).
            setTimeout(() => { this.commentField.nativeElement.focus(); }, 1);
        } else {
            this._resetComment();
            this.error = false;
        }
    }

    /**
     * Returns TRUE if the caller is anonymous.
     */
    isCallerAnonymous(): boolean {
        return environment.anonymousUserID === this.Notes.getSettings().crm_contact_id;
    }

    /**
     * Returns TRUE if the caller is a non-tenant.
     */
    isCallerNonTenant(): boolean {
        return environment.nonTenantUserID === this.Notes.getSettings().crm_contact_id;
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
        return this.Notes.getSettings().tenancy_reference;
        // return this.Call.getTenancyReference();
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
        const has_call_id = !!(this.Notes.getSettings().call_id);
        const has_call_nature = this.isCallNatureSelected();

        return !is_saving && (has_comment && has_call_id && has_call_nature);
    }

    /**
     * Returns TRUE if we can view the current caller's notes.
     */
    canViewNotes(): boolean {
        return this.Call.hasCaller() && !(this.isCallerAnonymous() || this.isCallerNonTenant());
    }

    /**
     * Navigate to the view notes page.
     */
    viewNotes() {
        this.router.navigateByUrl(PAGES.VIEW_NOTES.route);
    }

    /**
     * This is called when the form is submitted.
     * Here we save a manual note.
     */
    saveNote() {
        if (this.canSaveNote()) {
            this.error = false;
            this.saving = true;

            this.Notes.recordManualNote(this.call_nature, this.comment, this.transferred)
                .pipe(take(1))
                .pipe(finalize(() => {
                    this.saving = false;
                }))
                .subscribe(
                    () => {
                        this._resetComment();
                        if (!environment.disable.noteCloseOnSave) {
                            // Automatically close the note form.
                            this.Notes.hide();
                            // } else {
                            // Display a confirmation that the note was saved.

                            // Reset the comment.
                            this.comment = null;
                        }
                    },
                    (error) => {
                        this.error = true;
                    }
                );
        }
    }

    /**
     * Simply reset the comment body.
     */
    _resetComment() {
        this.comment = null;
        this.transferred = false;
    }

    /**
     *
     */
    selectedCallNature(selection: ILogCallSelection) {
        this.call_nature = selection;
    }

    /**
     *
     */
    isCallNatureSelected(): boolean {
        if (this.call_nature) {
            if (this.call_nature.call_reason) {
                return (CALL_REASON.OTHER !== this.call_nature.call_reason.id || !!(this.call_nature.other_reason));
            }
        }
        return false;
    }

}
