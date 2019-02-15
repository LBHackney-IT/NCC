import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageTransactionComponent } from './transaction.component';

describe('PageTransactionComponent', () => {
    let component: PageTransactionComponent;
    let fixture: ComponentFixture<PageTransactionComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PageTransactionComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PageTransactionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
