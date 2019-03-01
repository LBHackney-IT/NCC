import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallerAddressComponent } from './caller-address.component';

describe('CallerAddressComponent', () => {
  let component: CallerAddressComponent;
  let fixture: ComponentFixture<CallerAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallerAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallerAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
