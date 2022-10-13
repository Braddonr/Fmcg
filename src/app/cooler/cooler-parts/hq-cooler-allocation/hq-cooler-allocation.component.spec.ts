import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HqCoolerAllocationComponent } from './hq-cooler-allocation.component';

describe('HqCoolerAllocationComponent', () => {
  let component: HqCoolerAllocationComponent;
  let fixture: ComponentFixture<HqCoolerAllocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HqCoolerAllocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HqCoolerAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
