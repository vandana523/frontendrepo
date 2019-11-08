import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignationManagementComponent } from './designation-management.component';

describe('DesignationManagementComponent', () => {
  let component: DesignationManagementComponent;
  let fixture: ComponentFixture<DesignationManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignationManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignationManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
