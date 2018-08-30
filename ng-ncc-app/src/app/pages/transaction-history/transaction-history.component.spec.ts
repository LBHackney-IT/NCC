import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageTransactionHistoryComponent } from './transaction-history.component';

describe('PageTransactionHistoryComponent', () => {
    let component: PageTransactionHistoryComponent;
    let fixture: ComponentFixture<PageTransactionHistoryComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PageTransactionHistoryComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PageTransactionHistoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
