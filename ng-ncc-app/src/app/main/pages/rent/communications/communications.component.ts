import { LOCALE_ID, Component, Inject, Injector, OnInit } from '@angular/core';
import { formatCurrency } from '@angular/common';
import { takeUntil, concatMap } from 'rxjs/operators';

import { PAGES } from '../../../../common/constants/pages.constant';
import { CommsOption } from '../../../../common/classes/comms-option.class';
import { PageCommunications } from '../../abstract/communications';
import { NCCAPIService } from '../../../../common/API/NCCAPI/ncc-api.service';
import { IAccountDetails } from '../../../../common/interfaces/account-details';
import { IAddressSearchGroupedResult } from '../../../../common/interfaces/address-search-grouped-result';
import { ITenancyAgreementDetails } from '../../../../common/interfaces/tenancy-agreement-details';
import { IRentBreakdown } from '../../../../common/interfaces/rent-breakdown';

@Component({
    selector: 'app-rent-communications',
    templateUrl: './communications.component.html',
    styleUrls: ['./communications.component.css']
})
export class PageRentCommunicationsComponent extends PageCommunications implements OnInit {

    NCCAPI: NCCAPIService;
    tenancy: IAddressSearchGroupedResult;
    tenancyDetails: ITenancyAgreementDetails;
    is_non_tenant: boolean;
    is_identified: boolean;
    accountBreakdown: IRentBreakdown[];

    constructor(@Inject(LOCALE_ID) private locale: string, private injector: Injector) {
        super(injector);
        this.NCCAPI = this.injector.get(NCCAPIService);
    }

    /**
     *
     */
    ngOnInit() {
        super.ngOnInit();
        this.PageTitle.set(PAGES.RENT_COMMS.label);
        this.tenancy = this.Call.getTenancy();
        this.is_non_tenant = this.Call.isCallerNonTenant();
        this.is_identified = this.Call.isCallerIdentified();

        // Obtain the account details.
        this.Call.getAccount()
            .pipe(takeUntil(this._destroyed$))
            .pipe(concatMap((account: IAccountDetails) => {
                this.account_details = account;
                return this.NCCAPI.getRentBreakdown(account.tagReferenceNumber);
            }))
            .subscribe((data: IRentBreakdown[]) => {
                this.accountBreakdown = data;
                console.log('Account breakdown:', data);
            });

        // Obtain tenancy agreeement details.
        this.NCCAPI.getTenancyAgreementDetails(this.account_details.tagReferenceNumber)
            .pipe(takeUntil(this._destroyed$))
            .subscribe((details: ITenancyAgreementDetails) => {
                this.tenancyDetails = details;
            });
    }

    /**
     *
     */
    selectedOption(option: CommsOption) {
        super.selectedOption(option);

        // This page will provide access to GOV.UK Notify templates that will require DPA answers from the caller.
        if (option) {
            if (option.isSensitive()) {
                if (this.Call.isCallerNonTenant()) {
                    // Display a DPA dialogue for non-tenant callers.
                    this.modal.dpa_non_tenant = true;
                } else {
                    // Display a DPA dialogue for identified callers.
                    this.modal.dpa_identified = true;
                }
            } else {
                this.updatePreview();
            }
        }
    }

    /**
     *
     */
    isSensitiveTemplateSelected(): boolean {
        return this.selected_option && this.selected_option.isSensitive();
    }

    /**
     * Update the comms template preview with specific values for template paramteters.
     */
    updatePreview() {
        super.updatePreview();
        if (this.isSensitiveTemplateSelected() && this.preview) {
            this.preview.parameters = {
                'Tenancy reference': this.account_details.tagReferenceNumber,
                'Rent balance': formatCurrency(this.tenancyDetails.displayBalance, this.locale, '£'),
                'Rent amount': formatCurrency(this.account_details.rent, this.locale, '£'),
                'Service balance': formatCurrency(this.tenancyDetails.displayBalance, this.locale, '£'),
                'Service amount': formatCurrency(this._accountServiceCharge, this.locale, '£'),
            };
        }
    }

    /**
     * Returns the service charge for the account, if present.
     */
    private get _accountServiceCharge() {
        let row: IRentBreakdown;
        if (this.accountBreakdown) {
            row = this.accountBreakdown.find((row: IRentBreakdown) => 'DSC' === row.code);
            // TODO we will probably want a constants file containing all possible rent breakdown codes.
        }

        console.log('Service charge is:', row);

        return row ? row.value : null;
    }

    /**
     *
     */
    commsSuccess() {
        // Reset the comms information.
        this.resetComms();
    }

    /**
     *
     */
    getTenancyAddress(): string {
        if (this.tenancy) {
            return this.tenancy.address;
        }
    }

}
