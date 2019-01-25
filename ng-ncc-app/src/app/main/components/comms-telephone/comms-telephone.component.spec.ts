import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommsTelephoneComponent } from './comms-telephone.component';

describe('CommsTelephoneComponent', () => {
  let component: CommsTelephoneComponent;
  let fixture: ComponentFixture<CommsTelephoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommsTelephoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommsTelephoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
