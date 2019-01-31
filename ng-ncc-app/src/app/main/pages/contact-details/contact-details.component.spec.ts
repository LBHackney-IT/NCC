import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageContactDetailsComponent } from './contact-details.component';

describe('PageContactDetailsComponent', () => {
    let component: PageContactDetailsComponent;
    let fixture: ComponentFixture<PageContactDetailsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PageContactDetailsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PageContactDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
