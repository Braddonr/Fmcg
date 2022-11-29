import { ViewOrderComponent } from './view-order/view-order.component';
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { OrdersListComponent } from "./orders-list/orders-list.component";
import { PendingOrdersComponent } from './pending-orders/pending-orders.component';

const routes: Routes = [

    // orders
    {
        path: 'orders-list',
        component: OrdersListComponent,
        data: {
            breadcrumb: "All Orders"
        }
    },
    // view orders
    {
        path: 'view-order',
        component: ViewOrderComponent,
        data: {
            breadcrumb: "Order-View"
        }
    },
     // pending orders
     {
        path: 'pending-orders',
        component: PendingOrdersComponent,
        data: {
            breadcrumb: "Pending Orders"
        }
    }
   
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class OrdersRoutingModule { }