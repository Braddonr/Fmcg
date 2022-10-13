import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AllWorkflowsComponent } from './components/all-workflows/all-workflows.component';
import { ViewWorflowComponent } from './components/view-worflow/view-worflow.component';

const routes: Routes = [
    {
        path: 'list-workflows',
        component: AllWorkflowsComponent,
        data: {
            title: 'List Workflows',
            breadcrumb: 'List Workflows'
        }
    },
    {
        path: 'manage-workflow/:id',
        component: ViewWorflowComponent,
        data: {
            title: 'View Workflow',
            breadcrumb: 'View Workflow'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class WorkflowRoutingModule { }