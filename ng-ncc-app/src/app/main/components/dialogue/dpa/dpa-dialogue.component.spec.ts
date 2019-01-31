import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DPADialogueComponent } from './dpa-dialogue.component';

describe('DPADialogueComponent', () => {
    let component: DPADialogueComponent;
    let fixture: ComponentFixture<DPADialogueComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DPADialogueComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DPADialogueComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
