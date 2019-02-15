import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentBreakdownComponent } from './rent-breakdown.component';

describe('RentBreakdownComponent', () => {
  let component: RentBreakdownComponent;
  let fixture: ComponentFixture<RentBreakdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentBreakdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentBreakdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
