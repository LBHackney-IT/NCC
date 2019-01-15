import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressTenantsResultComponent } from './address-tenants-result.component';

describe('AddressTenantsResultComponent', () => {
  let component: AddressTenantsResultComponent;
  let fixture: ComponentFixture<AddressTenantsResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressTenantsResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressTenantsResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
