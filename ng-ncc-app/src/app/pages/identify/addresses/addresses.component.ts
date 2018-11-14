import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap, take } from 'rxjs/operators';

import { PAGES } from '../../../constants/pages.constant';
import { HackneyAPIService } from '../../../API/HackneyAPI/hackney-api.service';
import { AddressSearchService } from '../../../services/address-search.service';
import { BackLinkService } from '../../../services/back-link.service';
import { IAddressSearchGroupedResult } from '../../../interfaces/address-search-grouped-result';
import { ICitizenIndexSearchResult } from '../../../interfaces/citizen-index-search-result';

@Component({
    selector: 'app-addresses',
    templateUrl: './addresses.component.html',
    styleUrls: ['./addresses.component.scss']
})
export class PageIdentifyAddressesComponent implements OnInit {

    results: ICitizenIndexSearchResult[];
    error: boolean;

    /**
     *
     */
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private AddressSearch: AddressSearchService,
        private BackLink: BackLinkService,
        private HackneyAPI: HackneyAPIService
    ) { }

    ngOnInit() {
        this.AddressSearch.performSearch()
            .pipe(take(1))
            .subscribe(
                () => {
                    this.results = this.AddressSearch.getAddressResults();
                },
                (error) => {
                    console.error(error);
                    this.error = true;
                }
            );
    }

    /**
     * Called when an address is selected from search results.
     */
    addressSelected(result: IAddressSearchGroupedResult) {
        this.AddressSearch.setAddress(result);

        // Navigate to the tenants list subpage.
        this.router.navigate([`../${PAGES.IDENTIFY_TENANTS.route}`], { relativeTo: this.route });
    }

}
