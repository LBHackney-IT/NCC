import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ManageATenancyAPIService } from '../../common/API/ManageATenancyAPI/manageatenancy-api.service';
import { NonTenantCaller } from '../../common/classes/non-tenant-caller.class';
import { ICaller } from '../../common/interfaces/caller';
import { IAccountDetails } from '../../common/interfaces/account-details';
import { IAddressSearchGroupedResult } from '../../common/interfaces/address-search-grouped-result';

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
