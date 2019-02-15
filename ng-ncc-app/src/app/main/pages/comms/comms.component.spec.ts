import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageCommsComponent } from './comms.component';

describe('PageCommsComponent', () => {
    let component: PageCommsComponent;
    let fixture: ComponentFixture<PageCommsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PageCommsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PageCommsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
