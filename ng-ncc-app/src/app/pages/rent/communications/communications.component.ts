import { LOCALE_ID, Component, Inject, Injector, OnInit } from '@angular/core';
import { formatCurrency } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PAGES } from '../../../constants/pages.constant';
import { CommsOption } from '../../../classes/comms-option.class';
import { PageCommunications } from '../../abstract/communications';
import { DPAService } from '../../../services/dpa.service';
import { NextPaymentService } from '../../../services/next-payment.service';
import { IAccountDetails } from '../../../interfaces/account-details';
import { IAddressSearchGroupedResult } from '../../../interfaces/address-search-grouped-result';

@Component({
    selector: 'app-rent-communications',
    templateUrl: './communications.component.html',
    styleUrls: ['./communications.component.css']
})
export class PageRentCommunicationsComponent extends PageCommunications implements OnInit {

    NextPayment: NextPaymentService;
    tenancy: IAddressSearchGroupedResult;
    is_non_tenant: boolean;
    is_identified: boolean;

    constructor(@Inject(LOCALE_ID) private locale: string, private injector: Injector) {
        super(injector);
        this.NextPayment = this.injector.get(NextPaymentService);
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
        this.Call.getAccount()
            .pipe(takeUntil(this._destroyed$))
            .subscribe((account: IAccountDetails) => { this.account_details = account; });
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
     *
     */
    updatePreview() {
        super.updatePreview();
        if (this.isSensitiveTemplateSelected() && this.preview) {
            const next_payment = this.NextPayment.calculate(this.account_details);
            this.preview.parameters = {
                'Tenancy reference': this.account_details.tagReferenceNumber,
                'Rent balance': formatCurrency(next_payment, this.locale, '£'),
                'Rent amount': formatCurrency(this.account_details.rent, this.locale, '£')
            };
        }
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
            return [
                this.tenancy.addressLine1,
                this.tenancy.addressLine2,
                this.tenancy.addressLine3,
                this.tenancy.addressCity,
                this.tenancy.postCode
            ]
                .filter((row) => !!(row))
                .join('<br>');
        }
    }

}
