import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageLastCallsComponent } from './last-calls.component';

describe('PageLastCallsComponent', () => {
    let component: PageLastCallsComponent;
    let fixture: ComponentFixture<PageLastCallsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PageLastCallsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PageLastCallsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
