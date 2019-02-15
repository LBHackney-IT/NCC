import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageRentCommunicationsComponent } from './communications.component';

describe('PageRentCommunicationsComponent', () => {
    let component: PageRentCommunicationsComponent;
    let fixture: ComponentFixture<PageRentCommunicationsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PageRentCommunicationsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PageRentCommunicationsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
