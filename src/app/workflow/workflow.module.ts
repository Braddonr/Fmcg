import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkflowRoutingModule } from './workflow-routing.module';
import { SharedModule } from '../shared/shared.module';

import { AllWorkflowsComponent } from './components/all-workflows/all-workflows.component';
import { AddWorkflowComponent } from './components/add-workflow/add-workflow.component';
import { ViewWorflowComponent } from './components/view-worflow/view-worflow.component';
import { AddWorflowStepComponent } from './components/add-worflow-step/add-worflow-step.component';


@NgModule({
  declarations: [
    AllWorkflowsComponent,
    AddWorkflowComponent,
    ViewWorflowComponent,
    AddWorflowStepComponent
  ],
  imports: [
    CommonModule,
    WorkflowRoutingModule,
    SharedModule
  ]
})
export class WorkflowModule { }
