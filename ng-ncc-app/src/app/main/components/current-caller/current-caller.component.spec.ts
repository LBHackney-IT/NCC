import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentCallerComponent } from './current-caller.component';

describe('CurrentCallerComponent', () => {
  let component: CurrentCallerComponent;
  let fixture: ComponentFixture<CurrentCallerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentCallerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentCallerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
