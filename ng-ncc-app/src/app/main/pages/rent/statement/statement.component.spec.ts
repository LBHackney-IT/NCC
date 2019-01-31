import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageRentStatementComponent } from './statement.component';

describe('PageRentStatementComponent', () => {
    let component: PageRentStatementComponent;
    let fixture: ComponentFixture<PageRentStatementComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PageRentStatementComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PageRentStatementComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
