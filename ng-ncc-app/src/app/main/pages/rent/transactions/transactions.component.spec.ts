import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageRentTransactionsComponent } from './transactions..component';

describe('PageRentTransactionsComponent', () => {
    let component: PageRentTransactionsComponent;
    let fixture: ComponentFixture<PageRentTransactionsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PageRentTransactionsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PageRentTransactionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
