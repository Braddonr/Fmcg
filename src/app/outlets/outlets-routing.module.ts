import { ViewOutletsComponent } from './view-outlets/view-outlets.component';
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { OutletsListComponent } from "./outlets-list/outlets-list.component";
import { PendingAddComponent } from './pending-add/pending-add.component';

const routes: Routes = [

    // outlets
    {
        path: 'list-outlets',
        component: OutletsListComponent,
        data: {
            breadcrumb: "All Outlets"
        }
    },
    // view outlets
    {
        path: 'view-outlets/:id',
        component: ViewOutletsComponent,
        data: {
            breadcrumb: "view"
        }
    },
    {
        path: 'pending-outlets',
        component: PendingAddComponent,
        data: {
            breadcrumb: "Pending Outlets"
        }
    },


]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class OutletsRoutingModule { }