import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallNatureComponent } from './call-nature.component';

describe('CallNatureComponent', () => {
  let component: CallNatureComponent;
  let fixture: ComponentFixture<CallNatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallNatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallNatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
