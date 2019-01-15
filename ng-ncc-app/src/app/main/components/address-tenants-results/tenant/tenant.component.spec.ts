import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressResultTenantComponent } from './tenant.component';

describe('AddressResultTenantComponent', () => {
    let component: AddressResultTenantComponent;
    let fixture: ComponentFixture<AddressResultTenantComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AddressResultTenantComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AddressResultTenantComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
