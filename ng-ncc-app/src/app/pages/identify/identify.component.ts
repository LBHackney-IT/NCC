import { environment } from '../../../environments/environment';
import { AfterViewChange, Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PAGES } from '../../constants/pages.constant';
import { HackneyAPIService } from '../../API/HackneyAPI/hackney-api.service';
import { ICitizenIndexSearchResult } from '../../interfaces/citizen-index-search-result';
import { IAddressSearchGroupedResult } from '../../interfaces/address-search-grouped-result';
import { IdentifiedCaller } from '../../classes/identified-caller.class';
import { NonTenantCaller } from '../../classes/non-tenant-caller.class';
import { AnonymousCaller } from '../../classes/anonymous-caller.class';
import { ICaller } from '../../interfaces/caller';
import { CallService } from '../../services/call.service';
import { AddressSearchService } from '../../services/address-search.service';
import { BackLinkService } from '../../services/back-link.service';
import { PageTitleService } from '../../services/page-title.service';

@Component({
    selector: 'app-page-identify',
    templateUrl: './identify.component.html',
    styleUrls: ['./identify.component.css']
})
export class PageIdentifyComponent implements AfterViewChange, OnInit, OnDestroy {

    private _destroyed$ = new Subject();

    is_searching: boolean;
    disable_identify_caller: boolean = environment.disable.identifyCaller;
    existing_call: boolean;

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

        if (this.Call.hasTenancy()) {
            this.existing_call = true;
            this.addressSelected(this.Call.getTenancy());
        }

        // Enable the app's back link if there's no current caller.
        if (!this.Call.hasCaller()) {
            this.BackLink.enable();
            this.BackLink.setTarget(`/${PAGES.LOG_CALL.route}`);
        }
    }

    ngAfterViewChange() {
        this.is_searching = this.AddressSearch.isSearching();
    }

    ngOnDestroy() {
        this._destroyed$.next();
    }

    /**
     * Performs a Citizen Index search.
     */
    performSearch(event: Event) {
        if ((event && event.defaultPrevented) || this.disable_identify_caller || this.searching) {
            return;
        }

        this.AddressSearch.setPostcode(this.postcode);
        this.router.navigate([`./${PAGES.IDENTIFY_ADDRESSES.route}`], { relativeTo: this.route });
    }

    /**
     * Returns TRUE if the user can enter a search term.
     */
    canUseSearch() {
        return !(this.disable_identify_caller || this.is_searching);
    }

    /**
     * Returns TRUE if the user can peform a search for details.
     */
    canPerformSearch() {
        return this.canUseSearch() && !!(this.postcode);
    }

}
