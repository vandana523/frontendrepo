import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmpopComponent } from './confirmpop.component';

describe('ConfirmpopComponent', () => {
  let component: ConfirmpopComponent;
  let fixture: ComponentFixture<ConfirmpopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmpopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmpopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
