import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageAddNotesComponent } from './add-notes.component';

describe('PageAddNotesComponent', () => {
    let component: PageAddNotesComponent;
    let fixture: ComponentFixture<PageAddNotesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PageAddNotesComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PageAddNotesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
