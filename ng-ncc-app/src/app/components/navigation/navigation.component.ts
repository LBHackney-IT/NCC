// NAVIGATION component.
// <app-navigation></app-navigation>

import { environment } from '../../../environments/environment';
import { AfterViewChecked, Component, ElementRef, HostListener, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CallService } from '../../services/call.service';
import { NotesService } from '../../services/notes.service';
import { ViewOnlyService } from '../../services/view-only.service';
import { PAGES } from '../../constants/pages.constant';

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements AfterViewChecked, OnDestroy {

    constructor(
        private Call: CallService,
        private Notes: NotesService,
        private ViewOnly: ViewOnlyService,
        private router: Router
    ) { }

    private _destroyed$ = new Subject();

    page_defs = PAGES;
    previous_call_count: number = environment.previousCallCount;
    disable_previous_calls: boolean = environment.disable.previousCalls;
    disable_additional_reasons: boolean = environment.disable.additionalCallReason;
    view_only = false;

    @ViewChild('notesButton') notesButton: ElementRef;

    // Listen to the scroll event on this component.
    @HostListener('scroll', ['$event'])
    onScrollEvent(event: UIEvent): void {
        this._positionNotesForm();
    }

    ngOnInit() {
        this.ViewOnly.updates()
            .pipe(takeUntil(this._destroyed$))
            .subscribe((status: boolean) => this.view_only = status);
    }
    /**
     *
     */
    ngAfterViewChecked() {
        this._positionNotesForm();
    }

    ngOnDestroy() {
        this._destroyed$.next();
    }

    /**
     *
     */
    private _positionNotesForm() {
        if (this.notesButton) {
            const el = this.notesButton.nativeElement;
            const rect = el.getBoundingClientRect();

            this.Notes.positionForm(rect.right, rect.top);
        }
    }

    /**
     * "Ends" the current call and navigates to the log call page.
     */
    endCall() {
        this.Call.reset();
        this.router.navigateByUrl(PAGES.PREVIOUS_CALLS.route);
    }

    /**
     * Returns TRUE if a call is currently active.
     * This is used to show/hide the end call link.
     */
    isCallNatureSelected(): boolean {
        return this.Call.hasCallNature();
    }

    /**
     * Returns TRUE if a call is currently active.
     * This is used to show/hide the end call link.
     */
    isCallActive(): boolean {
        return null !== this.Call.getCallID();
    }

    /**
     * Returns TRUE if we've started a call.
     * A call has been started if we have both a caller and a call nature (type and reason).
     */
    hasCallStarted(): boolean {
        return this.isCallNatureSelected && this.Call.hasCaller();
    }

    /**
     * Returns TRUE if a call is currently active and the caller has been identified.
     */
    isCallerIdentified(): boolean {
        return this.Call.isCallerIdentified();
    }

    /**
     * Returns TRUE if the "see caller notes" link should be enabled.
     */
    canViewNotes(): boolean {
        return this.Call.isCallerIdentified() || this.Call.isCallerNonTenant();
    }

    /**
     * Returns TRUE if a call is currently active and the caller is able to make a payment.
     */
    isCallerAbleToPay(): boolean {
        return this.Call.isCallerIdentified() || this.Call.isCallerNonTenant();
    }

    /**
     *
     */
    getIdentifyRoute(): string {
        const page = this.Call.hasTenancy() ? `${PAGES.IDENTIFY.route}/${PAGES.IDENTIFY_TENANTS.route}` : PAGES.IDENTIFY.route;
        return page;
    }

    /**
     *
     */
    getRentRoute(): string {
        return `/${PAGES.RENT.route}/${PAGES.RENT_TRANSACTIONS.route}`;
    }

    /**
     *
     */
    areNotesEnabled(): boolean {
        return this.Notes.isEnabled();
    }

    /**
     *
     */
    toggleAddNote() {
        this.Notes.toggle();
    }

}
