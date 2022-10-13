import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAuditTrailComponent } from './user-audit-trail.component';

describe('UserAuditTrailComponent', () => {
  let component: UserAuditTrailComponent;
  let fixture: ComponentFixture<UserAuditTrailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAuditTrailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAuditTrailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
