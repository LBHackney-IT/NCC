import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

import { ManageATenancyAPIService } from '../API/ManageATenancyAPI/manageatenancy-api.service';
import { NonTenantCaller } from '../classes/non-tenant-caller.class';
import { ICaller } from '../interfaces/caller';
import { IAccountDetails } from '../interfaces/account-details';
import { IAccountDetailsByReference } from '../interfaces/account-details-by-reference';
import { IAddressSearchGroupedResult } from '../interfaces/address-search-grouped-result';

@Injectable({
    providedIn: 'root'
})
export class AccountService {

    constructor(private ManageATenancyAPI: ManageATenancyAPIService) { }

    /**
     *
     */
    getFor(caller: ICaller, tenancy: IAddressSearchGroupedResult = null): Observable<IAccountDetails> {
        if (caller instanceof NonTenantCaller) {
            // Non-tenant callers themselves don't have an associated account.
            // However, we can obtain a respective account for a tenant at the property.
            const reference_crm_id = tenancy.results[0].crmContactId;
            return this.ManageATenancyAPI.getAccountDetails(reference_crm_id)
                .pipe(map((account: IAccountDetails) => Object.assign(
                    account, // the tenant's account information.
                    { accountid: environment.nonTenantUserID }, // use the non-tenant user ID.
                )));
        } else {
            return this.ManageATenancyAPI.getAccountDetails(caller.getContactID());
        }
    }

}
