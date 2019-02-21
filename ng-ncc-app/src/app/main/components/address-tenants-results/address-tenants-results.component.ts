import { Component, EventEmitter, Input, Output, OnChanges, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ICitizenIndexSearchResult } from '../../../common/interfaces/citizen-index-search-result';
import { IAddressSearchGroupedResult } from '../../../common/interfaces/address-search-grouped-result';
import { IdentifiedCaller } from '../../../common/classes/identified-caller.class';
import { NonTenantCaller } from '../../../common/classes/non-tenant-caller.class';
import { DPAService } from '../../../common/services/dpa.service';

@Component({
    selector: 'app-address-tenants-results',
    templateUrl: './address-tenants-results.component.html',
    styleUrls: ['./address-tenants-results.component.scss']
})
export class AddressTenantsResultsComponent implements OnInit, OnChanges, OnDestroy {
    @Input() address: IAddressSearchGroupedResult;
    @Input() disabled: boolean;
    @Input() isLeasehold: boolean;
    @Input() showBackButton: boolean;

    // When a tenant is selected and the Continue button is hit.
    @Output() selected = new EventEmitter<IdentifiedCaller>();

    // When a tenant is selected for editing contact details.
    @Output() beginEdit = new EventEmitter<IdentifiedCaller>();

    // When the user hits the back link.
    @Output() back = new EventEmitter<void>();

    // The selected tenant.
    _selected: IdentifiedCaller;

    // A list of tenants under the address passed to this component.
    tenants: IdentifiedCaller[];
    nonTenantCaller: NonTenantCaller;

    crm_contact_id: string;

    private _destroyed$ = new Subject();

    constructor(private DPA: DPAService) { }

    ngOnInit() {
        this.DPA.getUpdates()
            .pipe(takeUntil(this._destroyed$))
            .subscribe(() => {
                this.nonTenantCaller = new NonTenantCaller(this.DPA.getTenancyReference());
            });
    }

    ngOnChanges() {
        this._selected = null;
        if (this.address) {

            // Convert the list of results into IdentifiedCallers.
            // Since we're selecting a person from the list, we know that the caller is going to be identified.
            this.tenants = this.address.results.map((row) => new IdentifiedCaller(row));

            // If there's only one tenant, automatically select them.
            if (1 === this.tenants.length) {
                this._selected = this.tenants[0];
            }

            this.getDPAAnswers();
        }
    }

    ngOnDestroy() {
        this._destroyed$.next();
    }

    /**
     *
     */
    getDPAAnswers() {
        this.crm_contact_id = this.tenants[0].getContactID();
    }

    /**
     *
     */
    getTenancyDPAReference(): string {
        return this.DPA.getTenancyReference();
    }

    /**
     *
     */
    getTenancyDPABalance(): string {
        const result = this.DPA.getTenancyRentBalance();
        return result ? result.toString() : null;
    }

    /**
     *
     */
    getTenancyDPARent(): string {
        const result = this.DPA.getTenancyRentAmount();
        return result ? result.toString() : null;
    }

    /**
     *
     */
    trackByMethod(index: number, item: IdentifiedCaller): number {
        return index;
    }

    /**
     * Returns TRUE if there are no search results.
     */
    hasNoResults(): boolean {
        return this.tenants && 0 === this.tenants.length;
    }

    /**
     * Returns TRUE if there are search results.
     */
    hasResults(): boolean {
        return this.tenants && 0 < this.tenants.length;
    }

    /**
     * Returns the display address.
     */
    getAddress(): string {
        return this.address.address;
    }

    /**
     *
     */
    getAddressPostcode(): string {
        return this.address.results[0].postCode;
    }

    /**
     *
     */
    getAddressUPRN(): string {
        return this.address.results[0].uprn;
    }

    /**
     * Returns TRUE if a tenant is selected.
     */
    hasSelection(): boolean {
        return this.disabled ? false : (null !== this._selected);
    }

    /**
     * Called when the user hits the Continue button.
     */
    confirmSelection() {
        if (!this.disabled) {
            this.selected.emit(this._selected);
        }
    }

    /**
     * Called when the user hits the Back link.
     */
    goBack() {
        this.back.emit();
    }

    /**
     *
     */
    editContactDetails(citizen: IdentifiedCaller) {
        this.beginEdit.emit(citizen);
    }
}
