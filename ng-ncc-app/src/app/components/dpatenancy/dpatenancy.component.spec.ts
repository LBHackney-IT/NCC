import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DPATenancyComponent } from './dpatenancy.component';

describe('DPATenancyComponent', () => {
  let component: DPATenancyComponent;
  let fixture: ComponentFixture<DPATenancyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DPATenancyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DPATenancyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
