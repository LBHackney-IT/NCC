import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SensitiveCommsTemplatesComponent } from './sensitive-comms-templates.component';

describe('SensitiveCommsTemplatesComponent', () => {
  let component: SensitiveCommsTemplatesComponent;
  let fixture: ComponentFixture<SensitiveCommsTemplatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SensitiveCommsTemplatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SensitiveCommsTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
