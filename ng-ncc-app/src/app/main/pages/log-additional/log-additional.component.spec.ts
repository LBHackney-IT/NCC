import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageLogAdditionalComponent } from './log-additional.component';

describe('PageLogAdditionalComponent', () => {
    let component: PageLogAdditionalComponent;
    let fixture: ComponentFixture<PageLogAdditionalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PageLogAdditionalComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PageLogAdditionalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
