import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommsReceiptTemplatesComponent } from './comms-receipt-templates.component';

describe('CommsReceiptTemplatesComponent', () => {
  let component: CommsReceiptTemplatesComponent;
  let fixture: ComponentFixture<CommsReceiptTemplatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommsReceiptTemplatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommsReceiptTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
