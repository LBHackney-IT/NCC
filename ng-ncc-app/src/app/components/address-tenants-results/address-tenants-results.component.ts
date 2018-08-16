import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { CitizenIndexSearchResult } from '../../interfaces/citizen-index-search-result.interface';
import { AddressSearchGroupedResult } from '../../interfaces/address-search-grouped-result.interface';
import { IdentifiedCaller } from '../../classes/identified-caller.class';

@Component({
    selector: 'app-address-tenants-results',
    templateUrl: './address-tenants-results.component.html',
    styleUrls: ['./address-tenants-results.component.css']
})
export class AddressTenantsResultsComponent implements OnChanges {
    @Input() address: AddressSearchGroupedResult;

    // When a tenant is selected and the Continue button is hit.
    @Output() selected = new EventEmitter<IdentifiedCaller>();

    // When the user hits the back link.
    @Output() back = new EventEmitter<void>();

    // The selected tenant.
    _selected: IdentifiedCaller;

    // A list of tenants under the address passed to this component.
    tenants: IdentifiedCaller[];

    ngOnChanges() {
        this._selected = null;
        if (this.address) {

            // Convert the list of results into IdentifiedCallers.
            // Since we're selecting a person from the list, we know that the caller is going to be identified.
            this.tenants = this.address.results.map((row) => { return new IdentifiedCaller(row); });

            // If there's only one tenant, automatically select them.
            if (1 === this.tenants.length) {
                this._selected = this.tenants[0];
            }
        }
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
     * Returns TRUE if a tenant is selected.
     */
    hasSelection(): boolean {
        return null !== this._selected;
    }

    /**
     * Called when the user hits the Continue button.
     */
    confirmSelection() {
        this.selected.emit(this._selected);
    }

    /**
     * Called when the user hits the Back link.
     */
    goBack() {
        this.back.emit();
    }
}
