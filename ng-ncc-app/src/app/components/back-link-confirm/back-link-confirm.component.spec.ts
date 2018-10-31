import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackLinkConfirmComponent } from './back-link-confirm.component';

describe('BackLinkConfirmComponent', () => {
    let component: BackLinkConfirmComponent;
    let fixture: ComponentFixture<BackLinkConfirmComponent>;

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
        expect(component.query(By.css('a.govuk-back-link')).nativeElement).toBeTruthy();
    });

    it('should have an A tag of "Back"', () => {
        expect(component.query(By.css('a.govuk-back-link')).nativeElement.innerText).toBe('Back');
    });
});
