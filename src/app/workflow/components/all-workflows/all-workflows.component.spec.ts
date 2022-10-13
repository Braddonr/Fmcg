import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllWorkflowsComponent } from './all-workflows.component';

describe('AllWorkflowsComponent', () => {
  let component: AllWorkflowsComponent;
  let fixture: ComponentFixture<AllWorkflowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllWorkflowsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllWorkflowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
