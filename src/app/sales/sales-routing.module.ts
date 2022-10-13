import { CreditSalesComponent } from './credit-sales/credit-sales.component';
import { ReturnedItemsComponent } from './returned-items/returned-items.component';
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SalesListComponent } from "./sales-list/sales-list.component";

const routes: Routes = [

    // sales
    {
        path: 'all-sales',
        component: SalesListComponent,
        data: {
            breadcrumb: "All Sales"
        }
    },

    // returned-items
    {
        path: 'returned-items',
        component: ReturnedItemsComponent,
        data: {
            breadcrumb: "Returned Items"
        }
    },

    // credit-sales
    {
        path: 'credit-sales',
        component: CreditSalesComponent,
        data: {
            breadcrumb: "Credit Sales"
        }
    },
   

]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class SalesRoutingModule { }