import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { PAGES } from '../constants/pages.constant';
import { ManageATenancyAPIService } from '../API/ManageATenancyAPI/manageatenancy-api.service';
import { CallService } from '../services/call.service';
import { AddressSearchService } from '../services/address-search.service';
import { IAccountDetails } from '../interfaces/account-details';
import { IAddressSearchGroupedResult } from '../interfaces/address-search-grouped-result';

@Injectable()
export class IsLeaseholdPropertyResolver implements Resolve<any[]> {

    constructor(
        private router: Router,
        private Call: CallService,
        private ManageATenancyAPI: ManageATenancyAPIService,
        private AddressSearch: AddressSearchService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {

        const address: IAddressSearchGroupedResult = this.AddressSearch.getAddress();
        if (address) {
            const crmContactID = address.results[0].crmContactId;
            return this.ManageATenancyAPI.getAccountDetails(crmContactID)
                .pipe(take(1))
                .pipe(map((data: IAccountDetails) => {
                    const isLeasehold: boolean = (data && -1 !== data.tenuretype.indexOf('Leasehold'));
                    return isLeasehold;
                }));
        } else {
            // Assume not a leasehold property.
            return of(false);
        }

    }
}
