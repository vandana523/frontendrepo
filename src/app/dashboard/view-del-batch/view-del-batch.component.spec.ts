import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDelBatchComponent } from './view-del-batch.component';

describe('ViewDelBatchComponent', () => {
  let component: ViewDelBatchComponent;
  let fixture: ComponentFixture<ViewDelBatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewDelBatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDelBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
