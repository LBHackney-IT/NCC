import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ManageATenancyAPIService } from '../API/ManageATenancyAPI/manageatenancy-api.service';
import { NonTenantCaller } from '../classes/non-tenant-caller.class';
import { ICaller } from '../interfaces/caller';
import { IAccountDetails } from '../interfaces/account-details';
import { IAccountDetailsByReference } from '../interfaces/account-details-by-reference';

@Injectable({
    providedIn: 'root'
})
export class AccountService {

    constructor(private ManageATenancyAPI: ManageATenancyAPIService) { }

    /**
     *
     */
    getFor(caller: ICaller): Observable<IAccountDetails> {
        if (caller instanceof NonTenantCaller) {
            // Non-tenant callers themselves don't have an associated account.
            // However, we can obtain a respective account with their associated tenancy reference.
            // The result from getAccountDetailsByReference() must then be converted to IAccountDetails,
            // which should be very straightforward.
            return this.ManageATenancyAPI.getAccountDetailsByReference(caller.tenancy_reference)
                .pipe(map((data: IAccountDetailsByReference) => this._convertByReference(data)));
        } else {
            return this.ManageATenancyAPI.getAccountDetails(caller.getContactID());
        }
    }

    private _convertByReference(data: IAccountDetailsByReference): IAccountDetails {
        return {
            propertyReferenceNumber: data.propertyReferenceNumber,
            benefit: data.benefit,
            tagReferenceNumber: data.tagReferenceNumber,
            accountid: data.accountid,
            currentBalance: data.currentBalance,
            rent: data.rent,
            housingReferenceNumber: data.housingReferenceNumber,
            directdebit: data.directdebit,
            paymentReferenceNumber: null,
            tenancyStartDate: null,
            agreementType: null,
            isAgreementTerminated: null,
            tenuretype: null,
            accountType: null,
            // paymentReferenceNumber: data.paymentReferenceNumber,
            // tenancyStartDate: data.tenancyStartDate,
            // agreementType: data.agreementType,
            // isAgreementTerminated: data.isAgreementTerminated,
            // tenuretype: data.tenuretype,
            // accountType: data.accountType,
        }
    }

}
