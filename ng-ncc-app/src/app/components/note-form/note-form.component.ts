import { Component, Injector, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ContentAreaComponent } from '../content-area/content-area.component';
import { CallService } from '../../services/call.service';

@Component({
    selector: 'app-note-form',
    templateUrl: './note-form.component.html',
    styleUrls: ['./note-form.component.scss']
})
export class NoteFormComponent implements OnInit, OnDestroy {
    @ViewChild('commentField') commentField: ElementRef;

    private _destroyed$ = new Subject();

    TOP_MARGIN = 20;        // gap (in pixels) between the top of the content area and the toggle button.
    containerStyle: Object; // used to control the inline style of .note-form__container.
    comment: string;
    show: boolean;          // whether the note component is visible on the page.
    saving: boolean;        // set to TRUE when saving a note.
    expanded: boolean;      // whether the form for adding a note is expanded.

    constructor(private inj: Injector, private router: Router, private Call: CallService) {
        // We can listen for the <app-content-area/> eventScrolled event by using an Injector.
        // https://stackoverflow.com/a/40026333/4073160
        const parentComponent = this.inj.get(ContentAreaComponent);
        if (parentComponent) {
            // Subscribe to the ContentAreaComponent's eventScrolled [Observable] event.
            parentComponent.eventScrolled
                .pipe(
                    takeUntil(this._destroyed$)
                )
                .subscribe(value => this._reposition(value));
        }
    }

    ngOnInit() {
        this.expanded = false;
        this._resetComment();
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
        const outcome: boolean = this.Call.isCallerIdentified() && this.Call.hasCallNature();

        // Make sure the form is closed if we shouldn't show it.
        if (!outcome) {
            this.expanded = false;
        }

        return outcome;
    }

    /**
     * Show or hide the note form.
     */
    toggle() {
        this.expanded = !this.expanded;

        // Set the focus on the comment field if the form is visible.
        // The timeout is necessary because the field isn't immediately visible (and therefore not focusable).
        if (this.expanded) {
            setTimeout(() => { this.commentField.nativeElement.focus(); }, 1);
        }
    }

    /**
     * Returns TRUE if the caller is anonymous.
     */
    isCallerAnonymous(): boolean {
        return !this.Call.isCallerIdentified();
    }

    /**
     * Returns the caller's name.
     */
    getCallerName(): string {
        return this.Call.getCaller().getName();
    }

    /**
     *
     */
    getTenancyReference(): string {
        return this.Call.getTenancyReference();
    }

    /**
     *
     */
    getCallID(): string {
        return this.Call.getCallID();
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
        return !this.saving && !!(this.comment) && !!(this.getCallID());
    }

    /**
     * Navigate to the view notes page.
     */
    viewNotes() {
        this.router.navigateByUrl('/notes');
    }

    /**
     * This is called when the form is submitted.
     */
    saveNote() {
        if (this.canSaveNote()) {
            this.saving = true;
            const subscription = this.Call.recordManualNote(this.comment)
                .subscribe(
                    () => {
                        console.log('Added a note.');
                        this._resetComment();
                    },
                    (error) => {
                        console.log(error);
                    },
                    () => {
                        this.saving = false;
                        subscription.unsubscribe();
                    }
                );
        }
    }

    /**
     * Simply reset the comment body.
     */
    _resetComment() {
        this.comment = null;
    }

}
