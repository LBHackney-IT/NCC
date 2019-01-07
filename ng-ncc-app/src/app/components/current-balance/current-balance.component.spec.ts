import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentBalanceComponent } from './current-balance.component';

describe('CurrentBalanceComponent', () => {
  let component: CurrentBalanceComponent;
  let fixture: ComponentFixture<CurrentBalanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentBalanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
