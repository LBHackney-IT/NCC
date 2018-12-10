import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TenancyTypeComponent } from './tenancy-type.component';

describe('TenancyTypeComponent', () => {
  let component: TenancyTypeComponent;
  let fixture: ComponentFixture<TenancyTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TenancyTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenancyTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
