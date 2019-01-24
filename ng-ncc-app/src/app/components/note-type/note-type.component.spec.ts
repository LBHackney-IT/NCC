import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteTypeComponent } from './note-type.component';
import { NOTES } from '../../constants/notes.constant';

describe('NoteTypeComponent', () => {
    let component: NoteTypeComponent;
    let fixture: ComponentFixture<NoteTypeComponent>;
    let noteElement: HTMLElement;
    let helperElement: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [NoteTypeComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NoteTypeComponent);
        component = fixture.componentInstance;

        noteElement = fixture.debugElement.nativeElement.querySelector('span.note-type');
        helperElement = fixture.debugElement.nativeElement.querySelector('span.text');

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should contain a element reperesenting a note type', () => {
        expect(noteElement).toBeTruthy();
    });

    it('should contain an element representing helper text', () => {
        expect(helperElement).toBeTruthy();
    });

    // Test the different note types.
    describe('Manual', () => {
        component.type = NOTES.TYPE_MANUAL;
        fixture.detectChanges();

        it('should contain the letter "M"', () => {
            expect(noteElement.querySelector(':before').textContent).toBe('M');
        });

        it('should have the correct helper text', () => {
            expect(helperElement.textContent).toBe(NOTES.TYPE_MANUAL);
        });

    });

});
