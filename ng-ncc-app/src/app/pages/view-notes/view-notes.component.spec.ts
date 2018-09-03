import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageViewNotesComponent } from './view-notes.component';

describe('PageViewNotesComponent', () => {
    let component: PageViewNotesComponent;
    let fixture: ComponentFixture<PageViewNotesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PageViewNotesComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PageViewNotesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
