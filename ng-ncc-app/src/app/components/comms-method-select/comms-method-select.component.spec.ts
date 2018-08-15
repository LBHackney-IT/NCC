import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommsMethodSelectComponent } from './comms-method-select.component';

describe('CommsMethodSelectComponent', () => {
  let component: CommsMethodSelectComponent;
  let fixture: ComponentFixture<CommsMethodSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommsMethodSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommsMethodSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
