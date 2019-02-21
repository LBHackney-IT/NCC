import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatchDetailsComponent } from './patch-details.component';

describe('PatchDetailsComponent', () => {
  let component: PatchDetailsComponent;
  let fixture: ComponentFixture<PatchDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatchDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatchDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
