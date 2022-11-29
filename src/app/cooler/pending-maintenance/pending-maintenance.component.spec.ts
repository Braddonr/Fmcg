import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingMaintenanceComponent } from './pending-maintenance.component';

describe('PendingMaintenanceComponent', () => {
  let component: PendingMaintenanceComponent;
  let fixture: ComponentFixture<PendingMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingMaintenanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
