import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageIdentifyAddressesComponent } from './addresses.component';

describe('PageIdentifyAddressesComponent', () => {
    let component: PageIdentifyAddressesComponent;
    let fixture: ComponentFixture<PageIdentifyAddressesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PageIdentifyAddressesComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PageIdentifyAddressesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
