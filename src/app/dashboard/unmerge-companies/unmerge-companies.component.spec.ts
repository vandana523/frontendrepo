import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnmergeCompaniesComponent } from './unmerge-companies.component';

describe('UnmergeCompaniesComponent', () => {
  let component: UnmergeCompaniesComponent;
  let fixture: ComponentFixture<UnmergeCompaniesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnmergeCompaniesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnmergeCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
