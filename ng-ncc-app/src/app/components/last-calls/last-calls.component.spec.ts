import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastCallsComponent } from './last-calls.component';

describe('LastCallsComponent', () => {
  let component: LastCallsComponent;
  let fixture: ComponentFixture<LastCallsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastCallsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastCallsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
