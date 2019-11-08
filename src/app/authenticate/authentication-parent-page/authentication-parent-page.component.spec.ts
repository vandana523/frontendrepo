import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthenticationParentPageComponent } from './authentication-parent-page.component';

describe('AuthenticationParentPageComponent', () => {
  let component: AuthenticationParentPageComponent;
  let fixture: ComponentFixture<AuthenticationParentPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthenticationParentPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthenticationParentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
