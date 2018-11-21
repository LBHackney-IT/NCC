import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageRentSummaryComponent } from './summary.component';

describe('PageRentSummaryComponent', () => {
    let component: PageRentSummaryComponent;
    let fixture: ComponentFixture<PageRentSummaryComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PageRentSummaryComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PageRentSummaryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
