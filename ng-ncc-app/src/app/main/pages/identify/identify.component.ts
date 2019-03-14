import { environment } from '../../../../environments/environment';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';

import { PAGES } from '../../../common/constants/pages.constant';
import { CallService } from '../../../common/services/call.service';
import { AddressSearchService } from '../../../common/services/address-search.service';
import { NotesService } from '../../../common/services/notes.service';
import { PageTitleService } from '../../../common/services/page-title.service';
import { AnonymousCaller } from '../../../common/classes/anonymous-caller.class';

@Component({
    selector: 'app-page-identify',
    templateUrl: './identify.component.html',
    styleUrls: ['./identify.component.css']
})
export class PageIdentifyComponent implements OnInit {

    @ViewChild('searchName') searchNameForm: NgForm;
    @ViewChild('searchPostcode') searchPostcodeForm: NgForm;

    is_searching: boolean;
    disable_identify_caller: boolean = environment.disable.identifyCaller;
    existing_call: boolean;
    postcode: string;

    constructor(
        private router: Router,
        private Call: CallService,
        private AddressSearch: AddressSearchService,
        private Notes: NotesService,
        private PageTitle: PageTitleService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.PageTitle.set(PAGES.IDENTIFY.label);
        // this.AddressSearch.reset();

        this.existing_call = false;

        if (this.Call.isActive()) {
            if (this.Call.hasTenancy()) {
                this.existing_call = true;
            }
        } else {
            // We might be coming to this page from the View Notes page, so disable notes.
            this.Call.reset();
            this.Notes.disable();
        }

    }

    searchByName() {
        // Set the first and last name in the AddressSearch service, making sure the postcode is blank.
        this.AddressSearch.setFirstName(this.searchNameForm.value.firstName);
        this.AddressSearch.setLastName(this.searchNameForm.value.lastName);
        this.AddressSearch.setPostcode(null);

        // To avoid confusing the user, reset the postcode.
        this.searchPostcodeForm.resetForm();

        // Perform a search.
        this._performSearch();
    }

    /**
     * Performs a Citizen Index search.
     */
    searchByPostcode() {
        // Set the postcode in the AddressSearch service.
        this.AddressSearch.setPostcode(this.searchPostcodeForm.value.postcode);
        this.AddressSearch.setFirstName(null);
        this.AddressSearch.setLastName(null);

        // To avoid confusing the user, reset the first and last name.
        this.searchNameForm.resetForm();

        this._performSearch();
    }

    /**
     *
     */
    private _performSearch() {
        if (this.disable_identify_caller || this.AddressSearch.isSearching()) {
            return;
        }

        // Navigate to the addresses subpage.
        // If the addresses subpage is already displayed, this will have no effect.
        this.router.navigate([`./${PAGES.IDENTIFY_ADDRESSES.route}`], { relativeTo: this.route });

        // Perform the search for addresses matching the postcode.
        this.AddressSearch.performSearch()
            .pipe(take(1))
            .subscribe();
    }

    /**
     * Returns TRUE if the user can enter a search term.
     */
    canUseSearch() {
        return !(this.disable_identify_caller || this.AddressSearch.isSearching());
    }

    /**
     * Returns TRUE if the user can peform a search for details by postcode.
     */
    canPerformPostcodeSearch() {
        return this.canUseSearch() /*&& !!(this.searchPostcode.valid)*/;
    }

    /**
     * Returns TRUE if the user can peform a search for details by name.
     */
    canPerformNameSearch() {
        try {
            const isValid = this.searchNameForm.value.firstName.length >= 2 ||
                this.searchNameForm.value.lastName.length >= 2;
            // Perhaps a custom validator?
            return this.canUseSearch() && isValid;
        } catch (e) {
            return false;
        }
    }

    /**
     * Called if the user hits the Anonymous caller button.
     */
    anonymousSelected() {
        this.Call.setCaller(new AnonymousCaller);
        this.nextStep();
    }

    /**
     * Navigate to the next step, having selected a tenant (or an anonymous caller).
     */
    nextStep() {
        if (this.Call.hasCaller()) {
            // If caller is identified the ‘continue' button should take you to ’Caller Notes'.
            // If caller is anonymous the ‘caller is anonymous’ button should take you to ‘General Communications’.
            // Decided in isolation.
            this.router.navigateByUrl(this.Call.isCallerIdentified() ? PAGES.VIEW_NOTES.route : PAGES.COMMS.route);
        }
    }

}
