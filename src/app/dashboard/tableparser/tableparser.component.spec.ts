import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableparserComponent } from './tableparser.component';

describe('TableparserComponent', () => {
  let component: TableparserComponent;
  let fixture: ComponentFixture<TableparserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableparserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableparserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
