import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterpopupComponent } from './filterpopup.component';

describe('FilterpopupComponent', () => {
  let component: FilterpopupComponent;
  let fixture: ComponentFixture<FilterpopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterpopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
