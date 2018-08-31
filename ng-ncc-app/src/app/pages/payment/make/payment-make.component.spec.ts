import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagePaymentMakeComponent } from './payment-make.component';

describe('PagePaymentMakeComponent', () => {
    let component: PagePaymentMakeComponent;
    let fixture: ComponentFixture<PagePaymentMakeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PagePaymentMakeComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PagePaymentMakeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
