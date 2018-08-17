import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressSearchResultsComponent } from './address-search-results.component';

describe('AddressSearchResultsComponent', () => {
  let component: AddressSearchResultsComponent;
  let fixture: ComponentFixture<AddressSearchResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressSearchResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressSearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
