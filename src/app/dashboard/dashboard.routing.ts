import { DashboardComponent } from "./dashboard.component";
import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { SalesDashboardComponent } from "./sales/sales-dashboard/sales-dashboard.component";

 const routes: Routes = [
  
  {
    path: "sales-analytics",
    component: SalesDashboardComponent,
    data: {
      breadcrumb: "Sales Dashboard"
    }
  },
 
  {
    path: "",
  redirectTo: "sales-analytics",
  pathMatch: "full"
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule{}
