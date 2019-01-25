import { environment } from '../../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';

import { PAGES } from '../../../common/constants/pages.constant';
import { HackneyAPIService } from '../../../common/API/HackneyAPI/hackney-api.service';
import { ICitizenIndexSearchResult } from '../../../common/interfaces/citizen-index-search-result';
import { IAddressSearchGroupedResult } from '../../../common/interfaces/address-search-grouped-result';
import { CallService } from '../../../common/services/call.service';
import { AddressSearchService } from '../../../common/services/address-search.service';
import { BackLinkService } from '../../../common/services/back-link.service';
import { NotesService } from '../../../common/services/notes.service';
import { PageTitleService } from '../../../common/services/page-title.service';
import { AnonymousCaller } from '../../../common/classes/anonymous-caller.class';

@Component({
    selector: 'app-page-identify',
    templateUrl: './identify.component.html',
    styleUrls: ['./identify.component.css']
})
export class PageIdentifyComponent implements OnInit {

    is_searching: boolean;
    disable_identify_caller: boolean = environment.disable.identifyCaller;
    existing_call: boolean;
    postcode: string;

    constructor(
        private router: Router,
        private HackneyAPI: HackneyAPIService,
        private Call: CallService,
        private AddressSearch: AddressSearchService,
        private BackLink: BackLinkService,
        private Notes: NotesService,
        private PageTitle: PageTitleService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.PageTitle.set(PAGES.IDENTIFY.label);
        this.AddressSearch.reset();

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

    /**
     * Performs a Citizen Index search.
     */
    performSearch(event: Event) {
        if ((event && event.defaultPrevented) || this.disable_identify_caller || this.AddressSearch.isSearching()) {
            return;
        }

        // Set the postcode in the AddressSearch service.
        this.AddressSearch.setPostcode(this.postcode);

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
     * Returns TRUE if the user can peform a search for details.
     */
    canPerformSearch() {
        return this.canUseSearch() && !!(this.postcode);
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
