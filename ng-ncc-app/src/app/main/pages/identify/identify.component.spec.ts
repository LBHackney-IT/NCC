import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageIdentifyComponent } from './identify.component';

describe('PageIdentifyComponent', () => {
    let component: PageIdentifyComponent;
    let fixture: ComponentFixture<PageIdentifyComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PageIdentifyComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PageIdentifyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
