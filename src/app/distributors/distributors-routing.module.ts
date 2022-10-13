import { VanStockListComponent } from './van-stock-list/van-stock-list.component';
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AllDistributorsComponent } from "./all-distributors/all-distributors.component";
import { AllVehiclesComponent } from "./all-vehicles/all-vehicles.component";

const routes: Routes = [

    // distributors
    {
        path: 'all-distributors',
        component: AllDistributorsComponent,
        data: {
            breadcrumb: "All Distributors"
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

]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class DistributorsRoutingModule { }