import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { OrComponent } from './or.component';

describe('OrComponent', () => {
    let component: OrComponent;
    let fixture: ComponentFixture<OrComponent>;
    let de: DebugElement;
    let el: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [OrComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OrComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;
        el = de.nativeElement;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
        expect(el).toBeTruthy();
    });

    it('should ONLY display the word "OR"', () => {
        expect(el.textContent.toUpperCase()).toBe('OR');
    });

});
