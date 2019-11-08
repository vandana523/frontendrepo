import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MergecompaniesComponent } from './mergecompanies.component';

describe('MergecompaniesComponent', () => {
  let component: MergecompaniesComponent;
  let fixture: ComponentFixture<MergecompaniesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MergecompaniesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MergecompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
