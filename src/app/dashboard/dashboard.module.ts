import { CommonModule } from "@angular/common";
import { DashboardComponent } from "./dashboard.component";
import {  DashboardRoutingModule } from "./dashboard.routing";
import { NgModule } from "@angular/core";
import { SharedModule } from '../shared/shared.module';
import { QuickCardsComponent } from './quick-cards/quick-cards.component';
import { SalesDashboardComponent } from './sales/sales-dashboard/sales-dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    DashboardRoutingModule
  ],
  declarations: [DashboardComponent, QuickCardsComponent, SalesDashboardComponent]
})
export class DashboardModule {}
