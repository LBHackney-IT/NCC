import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import { PAGES } from '../../../constants/pages.constant';
import { AddressSearchService } from '../../../services/address-search.service';
import { IAddressSearchGroupedResult } from '../../../interfaces/address-search-grouped-result';
import { ICitizenIndexSearchResult } from '../../../interfaces/citizen-index-search-result';

@Component({
    selector: 'app-addresses',
    templateUrl: './addresses.component.html',
    styleUrls: ['./addresses.component.scss']
})
export class PageIdentifyAddressesComponent implements OnInit, OnDestroy {

    private _destroyed$ = new Subject();

    results: ICitizenIndexSearchResult[];
    error: boolean;

    /**
     *
     */
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private AddressSearch: AddressSearchService
    ) { }

    ngOnInit() {
        // Subscribe to changes to AddressSearch results, which will automatically update the list.
        this.AddressSearch.getAddressResults()
            .pipe(takeUntil(this._destroyed$))
            .subscribe(
                (results) => {
                    if (null === results) {
                        this.error = true;
                        this.results = null;
                    } else {
                        this.error = false;
                        this.results = <ICitizenIndexSearchResult[]>results;
                    }
                },
                () => {
                    this.error = true;
                    this.results = null;
                }
            );
    }

    ngOnDestroy() {
        this._destroyed$.next();
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
