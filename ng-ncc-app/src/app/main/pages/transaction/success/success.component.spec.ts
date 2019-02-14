import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageTransactionSuccessComponent } from './success.component';

describe('PageTransactionSuccessComponent', () => {
    let component: PageTransactionSuccessComponent;
    let fixture: ComponentFixture<PageTransactionSuccessComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PageTransactionSuccessComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PageTransactionSuccessComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
