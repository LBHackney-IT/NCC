import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressTenantsResultsComponent } from './address-tenants-results.component';

describe('AddressTenantsResultsComponent', () => {
    let component: AddressTenantsResultsComponent;
    let fixture: ComponentFixture<AddressTenantsResultsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AddressTenantsResultsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AddressTenantsResultsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
