import { Component, EventEmitter, Input, Output, OnChanges, OnInit } from '@angular/core';
import { CitizenIndexSearchResult } from '../../interfaces/citizen-index-search-result.interface';
import { AddressSearchGroupedResult } from '../../interfaces/address-search-grouped-result.interface';

@Component({
    selector: 'app-address-tenants-results',
    templateUrl: './address-tenants-results.component.html',
    styleUrls: ['./address-tenants-results.component.css']
})
export class AddressTenantsResultsComponent implements OnChanges, OnInit {
    @Input() address: AddressSearchGroupedResult;
    @Output() selected = new EventEmitter<CitizenIndexSearchResult>();
    @Output() back = new EventEmitter<void>();

    _selected: CitizenIndexSearchResult;
    tenants: CitizenIndexSearchResult[];

    constructor() { }

    ngOnInit() {
    }

    ngOnChanges() {
        this._selected = null;
        if (this.address) {
            this.tenants = this.address.results;

            // If there is only one tenant, automatically select them.
            if (1 === this.tenants.length) {
                this._selected = this.tenants[0];
            }
        }
        // TODO create a class for handling tenant/contact information.
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
