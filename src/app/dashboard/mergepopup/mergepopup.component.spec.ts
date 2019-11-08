import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MergepopupComponent } from './mergepopup.component';

describe('MergepopupComponent', () => {
  let component: MergepopupComponent;
  let fixture: ComponentFixture<MergepopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MergepopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MergepopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
