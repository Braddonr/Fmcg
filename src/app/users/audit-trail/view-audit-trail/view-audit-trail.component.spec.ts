import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAuditTrailComponent } from './view-audit-trail.component';

describe('ViewAuditTrailComponent', () => {
  let component: ViewAuditTrailComponent;
  let fixture: ComponentFixture<ViewAuditTrailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAuditTrailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAuditTrailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
