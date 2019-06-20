// NAVIGATION component.
// <app-navigation></app-navigation>

import { environment } from '../../../../environments/environment';
import { AfterViewChecked, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';

import { AddressSearchService } from '../../../common/services/address-search.service';
import { CallService } from '../../../common/services/call.service';
import { NotesService } from '../../../common/services/notes.service';
import { ViewOnlyService } from '../../../common/services/view-only.service';
import { PAGES } from '../../../common/constants/pages.constant';
import { IAccountDetails } from '../../../common/interfaces/account-details';

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements AfterViewChecked, OnDestroy {
    page_defs = PAGES;
    previous_call_count: number = environment.previousCallCount;
    disable_previous_calls: boolean = environment.disable.previousCalls;
    disable_additional_reasons: boolean = environment.disable.additionalCallReason;
    view_only = false;
    ending_call = false;
    showNotesButton: boolean;
    endingCall = false;
    notePending: boolean;
    propertyReferenceNumber = null;
    accountId = null;

    constructor(
        private AddressSearch: AddressSearchService,
        private Call: CallService,
        private Notes: NotesService,
        private ViewOnly: ViewOnlyService,
        private router: Router
    ) {
        this.showNotesButton = false;
    }

    private _destroyed$ = new Subject();

    @ViewChild('notesButton') notesButton: ElementRef;

    // Listen to the scroll event on this component.
    // @HostListener('scroll', ['$event'])
    // onScrollEvent(event: UIEvent): void {
    //     this._positionNotesForm();
    // }

    ngOnInit() {
        this.ViewOnly.updates()
            .pipe(takeUntil(this._destroyed$))
            .subscribe((status: boolean) => this.view_only = status);

        this.Notes.whenEnabled
            .pipe(takeUntil(this._destroyed$))
            .subscribe(() => {
                setTimeout(() => this._positionNotesForm(), 100);
            });

        this.Notes.whenShown
            .pipe(takeUntil(this._destroyed$))
            .subscribe(() => {
                setTimeout(() => this._positionNotesForm(), 100);
            });
        this.Notes.toggled
            .pipe(takeUntil(this._destroyed$))
            .subscribe((state: boolean) => {
                setTimeout(() => { this.showNotesButton = state; }, 100);
                // The timeout is necessary to prevent an "expression changed" error.
            })
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
     * Begins the process of ending the current call.
     * This is prevented if the agent is currently writing a note.
     */
    endCall() {
        if (this.Notes.isInProgress) {
            // Display a dialogue warning about an incomplete note.
            this.notePending = true;
        } else {
            // Display the call type/reason dialogue.
            this.endingCall = true;
        }
    }

    /**
     * "Ends" the current call and navigates to the log call page.
     */
    confirmEndCall() {
        this.Call.reset();
        this.AddressSearch.reset();
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
     * Returns TRUE if requesting a callback should be possible.
     */
    isCallbackPossible(): boolean {
        return this.Call.isCallerIdentified() || this.Call.isCallerNonTenant();
    }

    /**
     *
     */
    getIdentifyRoute(): string {
        return `${PAGES.IDENTIFY.route}/${PAGES.IDENTIFY_TENANTS.route}`;
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
    getRepairsHubLink(): string {
        if (this.Call.isCallerIdentified()) {
            this.propertyReferenceNumber = this.Call.getPropertyReferenceNumber();
            this.accountId = this.Call.getAccountId();
            return `${environment.repairsHubLink}/${this.propertyReferenceNumber}?account_id=${this.accountId}`;
        } else {
            return '';
        }
    }

    /**
     *
     */
    toggleAddNote() {
        this.Notes.toggle();
    }

}
