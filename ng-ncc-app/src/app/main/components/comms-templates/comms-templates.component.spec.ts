import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommsTemplatesComponent } from './comms-templates.component';

describe('CommsTemplatesComponent', () => {
  let component: CommsTemplatesComponent;
  let fixture: ComponentFixture<CommsTemplatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommsTemplatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommsTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
