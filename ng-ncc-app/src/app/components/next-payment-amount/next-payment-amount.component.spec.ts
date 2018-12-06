import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NextPaymentAmountComponent } from './next-payment-amount.component';

describe('NextPaymentAmountComponent', () => {
  let component: NextPaymentAmountComponent;
  let fixture: ComponentFixture<NextPaymentAmountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NextPaymentAmountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NextPaymentAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
