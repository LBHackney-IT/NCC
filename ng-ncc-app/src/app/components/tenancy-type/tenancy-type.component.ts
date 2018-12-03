import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';

import { IAccountDetails } from '../../interfaces/account-details';
import { ManageATenancyAPIService } from '../../API/ManageATenancyAPI/manageatenancy-api.service';

@Component({
    selector: 'app-tenancy-type',
    templateUrl: './tenancy-type.component.html',
    styleUrls: ['./tenancy-type.component.scss']
})
export class TenancyTypeComponent implements OnInit {
    @Input() crmContactID: string;

    account: IAccountDetails;

    // Hide the component if no account has been set.
    // NOTE: the method has to be defined as a getter (get), otherwise the class will ALWAYS be applied.
    @HostBinding('class.hidden')
    get isInvisible(): boolean {
        return !this.account;
    }

    // Tenure type classes.
    @HostBinding('class.is-leasehold')
    get isTypeLeasehold(): boolean {
        return this.account && -1 !== this.account.tenuretype.indexOf('Leasehold');
    }
    @HostBinding('class.is-special-circumstance')
    get isTypeSpecialCircumstance(): boolean {
        return this.account && -1 !== this.account.tenuretype.indexOf('Special Circumstance');
    }
    @HostBinding('class.is-introductory')
    get isTypeIntroductory(): boolean {
        return this.account && -1 !== this.account.tenuretype.indexOf('Introductory');
    }
    @HostBinding('class.is-tenancy')
    get isTypeTenancy(): boolean {
        return this.account && -1 !== this.account.tenuretype.indexOf('Tenancy');
    }

    constructor(private ManageATenancyAPI: ManageATenancyAPIService) { }

    ngOnInit() {
        this.ManageATenancyAPI.getAccountDetails(this.crmContactID)
            .pipe(take(1))
            .subscribe((data: IAccountDetails) => {
                this.account = data;
            })
    }

    getTenantType(): string {
        return this.account ? this.account.tenuretype : null;
    }

}
