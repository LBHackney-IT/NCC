// =========================================================================================================================================
// Layout > HEADER component integration test.
// =========================================================================================================================================
import { environment } from '../../../../environments/environment';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LayoutHeaderComponent } from './header.component';

describe('LayoutHeaderComponent', () => {
  let component: LayoutHeaderComponent;
  let fixture: ComponentFixture<LayoutHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayoutHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have .is-test-site by default', () => {
      const hasClass: boolean = fixture.debugElement.classes['is-test-site'];
      expect(hasClass).toBeTruthy();
  });

  it('should have .is-test-site on a non-production site', () => {
      environment.production = false;
      fixture.detectChanges();
      const hasClass: boolean = fixture.debugElement.classes['is-test-site'];
      expect(hasClass).toBeTruthy();
  });

  it('should not have .is-test-site on a live (production) site', () => {
      environment.production = true;
      fixture.detectChanges();
      const hasClass: boolean = fixture.debugElement.classes['is-test-site'];
      expect(hasClass).toBeFalsy();
  });

});
