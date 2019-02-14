import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallNatureDropdownComponent } from './call-nature-dropdown.component';

describe('CallNatureDropdownComponent', () => {
    let component: CallNatureDropdownComponent;
    let fixture: ComponentFixture<CallNatureDropdownComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CallNatureDropdownComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CallNatureDropdownComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
