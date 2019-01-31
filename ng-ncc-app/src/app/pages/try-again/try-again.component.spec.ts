import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageTryAgainComponent } from './try-again.component';

describe('PageTryAgainComponent', () => {
    let component: PageTryAgainComponent;
    let fixture: ComponentFixture<PageTryAgainComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PageTryAgainComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PageTryAgainComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
