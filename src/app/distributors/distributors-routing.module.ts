import { VanStockListComponent } from './van-stock-list/van-stock-list.component';
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AllDistributorsComponent } from "./all-distributors/all-distributors.component";
import { AllVehiclesComponent } from "./all-vehicles/all-vehicles.component";
import { ViewDistributorComponent } from './view-distributor/view-distributor.component';
import { PendingDistributorsComponent } from './pending-distributors/pending-distributors.component';

const routes: Routes = [

    // distributors
    {
        path: 'all-distributors',
        component: AllDistributorsComponent,
        data: {
            breadcrumb: "All Distributors"
        }
    },
    // view outlets
    {
        path: 'view-distributor/:id',
        component: ViewDistributorComponent,
        data: {
            breadcrumb: "view"
        }
    },
    // vehicles
    {
        path: 'all-vehicles',
        component: AllVehiclesComponent,
        data: {
            breadcrumb: "All Vehicles"
        }
    },
    // van-stock-list
    {
        path: 'van-stock-list',
        component: VanStockListComponent,
        data: {
            breadcrumb: "Van Stock List"
        }
    },
    //pending items
    {
        path: 'pending-items',
        component: PendingDistributorsComponent,
        data: {
            breadcrumb: "Pending Items"
        }
    },

]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class DistributorsRoutingModule { }