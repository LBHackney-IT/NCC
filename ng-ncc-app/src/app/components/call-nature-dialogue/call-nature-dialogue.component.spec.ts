import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallNatureDialogueComponent } from './call-nature-dialogue.component';

describe('CallNatureDialogueComponent', () => {
  let component: CallNatureDialogueComponent;
  let fixture: ComponentFixture<CallNatureDialogueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallNatureDialogueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallNatureDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
