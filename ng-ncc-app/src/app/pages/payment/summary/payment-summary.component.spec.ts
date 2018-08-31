import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagePaymentSummaryComponent } from './payment-summary.component';

describe('PagePaymentSummaryComponent', () => {
    let component: PagePaymentSummaryComponent;
    let fixture: ComponentFixture<PagePaymentSummaryComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PagePaymentSummaryComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PagePaymentSummaryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
