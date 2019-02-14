import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastCallsListComponent } from './last-calls.component';

describe('LastCallsListComponent', () => {
    let component: LastCallsListComponent;
    let fixture: ComponentFixture<LastCallsListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LastCallsListComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LastCallsListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
