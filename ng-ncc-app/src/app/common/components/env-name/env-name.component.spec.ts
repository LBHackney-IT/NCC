import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvNameComponent } from './env-name.component';

describe('EnvNameComponent', () => {
  let component: EnvNameComponent;
  let fixture: ComponentFixture<EnvNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnvNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
