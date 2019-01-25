import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelHeadingComponent } from './heading.component';

describe('PanelHeadingComponent', () => {
    let component: PanelHeadingComponent;
    let fixture: ComponentFixture<PanelHeadingComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PanelHeadingComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PanelHeadingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
