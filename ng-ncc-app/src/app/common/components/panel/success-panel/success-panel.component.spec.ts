import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessPanelComponent } from './success-panel.component';

describe('SuccessPanelComponent', () => {
    let component: SuccessPanelComponent;
    let fixture: ComponentFixture<SuccessPanelComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SuccessPanelComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SuccessPanelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
