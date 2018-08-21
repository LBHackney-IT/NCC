import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackLinkConfirmComponent } from './back-link-confirm.component';

describe('BackLinkConfirmComponent', () => {
  let component: BackLinkConfirmComponent;
  let fixture: ComponentFixture<BackLinkConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackLinkConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackLinkConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
