import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageLogCallComponent } from './log-call.component';

describe('PageLogCallComponent', () => {
    let component: PageLogCallComponent;
    let fixture: ComponentFixture<PageLogCallComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PageLogCallComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PageLogCallComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
