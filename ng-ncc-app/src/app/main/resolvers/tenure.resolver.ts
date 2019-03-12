import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { AddressSearchService } from '../../common/services/address-search.service';
import { IAccountDetails } from '../../common/interfaces/account-details';
import { IAddressSearchGroupedResult } from '../../common/interfaces/address-search-grouped-result';
import { ManageATenancyAPIService } from 'src/app/common/API/ManageATenancyAPI/manageatenancy-api.service';
import { ITenure } from 'src/app/common/interfaces/tenure';
import { TENURE } from 'src/app/common/constants/tenure.constant';

@Injectable()
export class TenureResolver implements Resolve<ITenure> {

    constructor(
        private ManageATenancyAPI: ManageATenancyAPIService,
        private AddressSearch: AddressSearchService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ITenure> {

        const address: IAddressSearchGroupedResult = this.AddressSearch.getAddress();
        if (address) {
            const crmContactID = address.results[0].crmContactId;
            return this.ManageATenancyAPI.getAccountDetails(crmContactID)
                .pipe(take(1))
                .pipe(map((account: IAccountDetails) => {
                    const tenure = TENURE.find((t: ITenure) => t.label === account.tenuretype)
                    return tenure;
                }));
        } else {
            // Assume not a leasehold property.
            return of(null);
        }

    }
}
