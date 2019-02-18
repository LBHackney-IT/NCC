// =========================================================================================================================================
// ENVIRONMENT NAME component integration test.
// =========================================================================================================================================

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnvNameComponent } from './env-name.component';

describe('EnvNameComponent', () => {
    let component: EnvNameComponent;
    let fixture: ComponentFixture<EnvNameComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [EnvNameComponent]
        });
        fixture = TestBed.createComponent(EnvNameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display the environment name', () => {
        const environmentName = component.getEnvironmentName();
        expect(fixture.debugElement.nativeElement.innerText).toContain(environmentName);
    });

});
