import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageRentPaymentComponent } from './payment.component';

describe('PageRentPaymentComponent', () => {
    let component: PageRentPaymentComponent;
    let fixture: ComponentFixture<PageRentPaymentComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PageRentPaymentComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PageRentPaymentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
