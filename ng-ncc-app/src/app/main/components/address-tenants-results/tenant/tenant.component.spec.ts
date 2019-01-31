import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AddressResultTenantComponent } from './tenant.component';

describe('AddressResultTenantComponent', () => {
    let component: AddressResultTenantComponent;
    let fixture: ComponentFixture<AddressResultTenantComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                FormsModule,
                HttpClientModule
            ],
            declarations: [AddressResultTenantComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
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
