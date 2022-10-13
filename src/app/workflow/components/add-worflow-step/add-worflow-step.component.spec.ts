import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWorflowStepComponent } from './add-worflow-step.component';

describe('AddWorflowStepComponent', () => {
  let component: AddWorflowStepComponent;
  let fixture: ComponentFixture<AddWorflowStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddWorflowStepComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWorflowStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
