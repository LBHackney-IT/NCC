import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValueListComponent } from './value-list.component';

describe('ValueListComponent', () => {
  let component: ValueListComponent;
  let fixture: ComponentFixture<ValueListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValueListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
