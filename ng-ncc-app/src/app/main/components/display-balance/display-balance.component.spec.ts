import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayBalanceComponent } from './display-balance.component';

describe('DisplayBalanceComponent', () => {
    let component: DisplayBalanceComponent;
    let fixture: ComponentFixture<DisplayBalanceComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DisplayBalanceComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DisplayBalanceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
