import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageIdentifyTenantsComponent } from './tenants.component';

describe('PageIdentifyTenantsComponent', () => {
    let component: PageIdentifyTenantsComponent;
    let fixture: ComponentFixture<PageIdentifyTenantsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PageIdentifyTenantsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PageIdentifyTenantsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
