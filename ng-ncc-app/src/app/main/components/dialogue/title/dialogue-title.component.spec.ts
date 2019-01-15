import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogueTitleComponent } from './dialogue-title.component';

describe('DialogueTitleComponent', () => {
  let component: DialogueTitleComponent;
  let fixture: ComponentFixture<DialogueTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogueTitleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogueTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
