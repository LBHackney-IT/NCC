import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValueListValueComponent } from './value-list-value.component';

describe('ValueListValueComponent', () => {
  let component: ValueListValueComponent;
  let fixture: ComponentFixture<ValueListValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValueListValueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValueListValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
