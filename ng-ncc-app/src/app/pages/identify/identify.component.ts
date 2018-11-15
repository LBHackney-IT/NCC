import { environment } from '../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';

import { PAGES } from '../../constants/pages.constant';
import { HackneyAPIService } from '../../API/HackneyAPI/hackney-api.service';
import { ICitizenIndexSearchResult } from '../../interfaces/citizen-index-search-result';
import { IAddressSearchGroupedResult } from '../../interfaces/address-search-grouped-result';
import { CallService } from '../../services/call.service';
import { AddressSearchService } from '../../services/address-search.service';
import { BackLinkService } from '../../services/back-link.service';
import { PageTitleService } from '../../services/page-title.service';

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
        private PageTitle: PageTitleService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.PageTitle.set(PAGES.IDENTIFY.label);
        this.AddressSearch.reset();

        this.existing_call = false;

        // if (this.Call.hasTenancy()) {
        //     this.existing_call = true;
        //     this.addressSelected(this.Call.getTenancy());
        // }

        // Enable the app's back link if there's no current caller.
        if (!this.Call.hasCaller()) {
            this.BackLink.enable();
            this.BackLink.setTarget(`/${PAGES.LOG_CALL.route}`);
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

}
