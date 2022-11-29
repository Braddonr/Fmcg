import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingDistributorsComponent } from './pending-distributors.component';

describe('PendingDistributorsComponent', () => {
  let component: PendingDistributorsComponent;
  let fixture: ComponentFixture<PendingDistributorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingDistributorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingDistributorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
