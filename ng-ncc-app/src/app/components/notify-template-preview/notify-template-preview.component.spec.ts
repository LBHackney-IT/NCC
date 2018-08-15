import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifyTemplatePreviewComponent } from './notify-template-preview.component';

describe('NotifyTemplatePreviewComponent', () => {
  let component: NotifyTemplatePreviewComponent;
  let fixture: ComponentFixture<NotifyTemplatePreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotifyTemplatePreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotifyTemplatePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
