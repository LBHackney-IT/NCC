import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagePlaygroundComponent } from './playground.component';

describe('PagePlaygroundComponent', () => {
    let component: PagePlaygroundComponent;
    let fixture: ComponentFixture<PagePlaygroundComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PagePlaygroundComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PagePlaygroundComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
