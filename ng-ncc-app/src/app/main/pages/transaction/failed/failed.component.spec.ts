import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageTransactionFailedComponent } from './failed.component';

describe('PageTransactionFailedComponent', () => {
    let component: PageTransactionFailedComponent;
    let fixture: ComponentFixture<PageTransactionFailedComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PageTransactionFailedComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PageTransactionFailedComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
