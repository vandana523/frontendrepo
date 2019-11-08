import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyManageComponent } from './company-manage.component';

describe('CompanyManageComponent', () => {
  let component: CompanyManageComponent;
  let fixture: ComponentFixture<CompanyManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
