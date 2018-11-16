import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageRentComponent } from './payment.component';

describe('PageRentComponent', () => {
    let component: PageRentComponent;
    let fixture: ComponentFixture<PageRentComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PageRentComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PageRentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
