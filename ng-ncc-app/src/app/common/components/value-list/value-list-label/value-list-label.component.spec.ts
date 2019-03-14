import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValueListLabelComponent } from './value-list-label.component';

describe('ValueListLabelComponent', () => {
  let component: ValueListLabelComponent;
  let fixture: ComponentFixture<ValueListLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValueListLabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValueListLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
