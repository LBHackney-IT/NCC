import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { DPATenancyComponent } from './dpa-tenancy.component';

describe('DPATenancyComponent', () => {
    let component: DPATenancyComponent;
    let fixture: ComponentFixture<DPATenancyComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DPATenancyComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DPATenancyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
