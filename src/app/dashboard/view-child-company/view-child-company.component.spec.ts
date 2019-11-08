import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewChildCompanyComponent } from './view-child-company.component';

describe('ViewChildCompanyComponent', () => {
  let component: ViewChildCompanyComponent;
  let fixture: ComponentFixture<ViewChildCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewChildCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewChildCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
