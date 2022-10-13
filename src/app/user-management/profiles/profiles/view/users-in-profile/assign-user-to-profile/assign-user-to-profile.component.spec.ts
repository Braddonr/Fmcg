import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignUserToProfileComponent } from './assign-user-to-profile.component';

describe('AssignUserToProfileComponent', () => {
  let component: AssignUserToProfileComponent;
  let fixture: ComponentFixture<AssignUserToProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignUserToProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignUserToProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
