import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BackLinkConfirmComponent } from './back-link-confirm.component';

describe('BackLinkConfirmComponent', () => {
    let component: BackLinkConfirmComponent;
    let fixture: ComponentFixture<BackLinkConfirmComponent>;
    const de: DebugElement = fixture.debugElement;
    const el: HTMLElement = de.nativeElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BackLinkConfirmComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BackLinkConfirmComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // A preliminary attempt at unit testing!
    it('should have an A tag with a class of govuk-back-link', () => {
        expect(de.query(By.css('a.govuk-back-link')).nativeElement).toBeTruthy();
    });

    it('should have an A tag of "Back"', () => {
        expect(de.query(By.css('a.govuk-back-link')).nativeElement.innerText).toBe('Back');
    });
});
