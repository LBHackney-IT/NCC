import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UHNotesComponent } from './uh-notes.component';

describe('UHNotesComponent', () => {
    let component: UHNotesComponent;
    let fixture: ComponentFixture<UHNotesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UHNotesComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UHNotesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
