import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunicationsPageComponent } from './communications-page.component';

describe('CommunicationsPageComponent', () => {
  let component: CommunicationsPageComponent;
  let fixture: ComponentFixture<CommunicationsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunicationsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunicationsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
