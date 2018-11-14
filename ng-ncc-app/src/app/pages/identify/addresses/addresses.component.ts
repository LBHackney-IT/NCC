import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap, take } from 'rxjs/operators';

import { HackneyAPIService } from '../../../API/HackneyAPI/hackney-api.service';
import { BackLinkService } from '../../../services/back-link.service';
import { ICitizenIndexSearchResult } from '../../../interfaces/citizen-index-search-result';

@Component({
    selector: 'app-addresses',
    templateUrl: './addresses.component.html',
    styleUrls: ['./addresses.component.scss']
})
export class PageIdentifyAddressesComponent implements OnInit {

    results: ICitizenIndexSearchResult[];
    no_results: boolean;
    error: boolean;

    /**
     *
     */
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private BackLink: BackLinkService,
        private HackneyAPI: HackneyAPIService
    ) { }

    /**
     *
     */
    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            const postcode = params.get('postcode');
            console.log('postcode', postcode);
            this.getAddressResults(params.get('postcode'));
        });
    }

    /**
     *
     */
    getAddressResults(postcode: string) {
        this.HackneyAPI.getCitizenIndexSearch(null, null, null, postcode)
            .pipe(take(1))
            .subscribe(
                (rows: ICitizenIndexSearchResult[]) => { this.results = rows; },
                (error) => {
                    console.error(error);
                    this.error = true;
                }
            );
    }
}
