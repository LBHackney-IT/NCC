import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { of } from 'rxjs';
import { catchError, take } from 'rxjs/operators';

import { PAGES } from '../../../../common/constants/pages.constant';
import { HackneyAPIService } from '../../../../common/API/HackneyAPI/hackney-api.service';
import { AddressSearchService } from '../../../../common/services/address-search.service';
import { BackLinkService } from '../../../../common/services/back-link.service';
import { CallService } from '../../../../common/services/call.service';
import { IAddressSearchGroupedResult } from '../../../../common/interfaces/address-search-grouped-result';
import { ICitizenIndexSearchResult } from '../../../../common/interfaces/citizen-index-search-result';
import { IdentifiedCaller } from '../../../../common/classes/identified-caller.class';
import { NonTenantCaller } from '../../../../common/classes/non-tenant-caller.class';
import { AnonymousCaller } from '../../../../common/classes/anonymous-caller.class';
import { ICaller } from '../../../../common/interfaces/caller';

@Component({
    selector: 'app-tenants',
    templateUrl: './tenants.component.html',
    styleUrls: ['./tenants.component.scss']
})
export class PageIdentifyTenantsComponent implements OnInit {

    address: IAddressSearchGroupedResult;
    error: boolean;
    confirm_non_tenant: boolean;
    isLeasehold: boolean;
    private _caller: ICaller;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private AddressSearch: AddressSearchService,
        private BackLink: BackLinkService,
        private Call: CallService,
        private HackneyAPI: HackneyAPIService
    ) { }

    ngOnInit() {
        this.address = this.AddressSearch.getAddress();

        // If there hasn't been an address selected, go to the Identify page.
        // TODO use a guard for this.
        if (!this.address) {
            this.router.navigateByUrl(PAGES.IDENTIFY.route);
        }

        this.route.data
            .pipe(take(1))
            .subscribe(
                (data: { isLeasehold: boolean }) => {
                    this.isLeasehold = data.isLeasehold;
                }
            );


        if (!this.Call.hasTenancy()) {
            // The Back link should go to the addresses subpage.
            this.BackLink.enable();
            this.BackLink.setTarget(`${PAGES.IDENTIFY.route}/${PAGES.IDENTIFY_ADDRESSES.route}`);
        }
    }

    /**
     * Called if we want to edit a tenant's contact details.
     */
    tenantToEdit(caller: IdentifiedCaller) {
        this.Call.setCaller(caller);
        this.Call.setTenancy(this.address);
        this.router.navigateByUrl(PAGES.EDIT_CONTACT_DETAILS.route)
            .catch(() => {
                caller.error = true;
                return of([]);
            });
    }

    /**
     * Called when a tenant is selected from address results.
     */
    tenantSelected(caller: ICaller) {
        if (caller instanceof NonTenantCaller) {
            this.confirm_non_tenant = true;
            this._caller = caller;
        } else {
            this._confirmCaller(caller);
        }
    }

    /**
     *
     */
    confirmNewTenant() {
        this._confirmCaller(this._caller);
    }

    /**
     *
     */
    private _confirmCaller(caller: ICaller) {
        this.Call.setCaller(caller);
        this.Call.setTenancy(this.address);
        this.nextStep();
    }

    /**
     * Navigate to the next step, having selected a tenant (or an anonymous caller).
     */
    nextStep() {
        if (this.Call.hasCaller()) {
            // If caller is identified the ‘continue' button should take you to ’Caller Notes'.
            // If caller is anonymous the ‘caller is anonymous’ button should take you to ‘General Communications’.
            // Decided in isolation.
            // TODO determine which page (comms or payment) to go to, based on the call type and reason.
            this.router.navigateByUrl(this.Call.isCallerIdentified() ? PAGES.VIEW_NOTES.route : PAGES.COMMS.route);
        }
    }

}