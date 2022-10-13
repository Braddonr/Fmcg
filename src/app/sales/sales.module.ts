import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { SalesListComponent } from './sales-list/sales-list.component';
import { SalesRoutingModule } from "./sales-routing.module";
import { ReturnedItemsComponent } from './returned-items/returned-items.component';
import { CreditSalesComponent } from './credit-sales/credit-sales.component';
import { MatTableExporterModule } from "mat-table-exporter";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";

@NgModule({
    declarations: [SalesListComponent, ReturnedItemsComponent, CreditSalesComponent],
    imports: [
        CommonModule,
        SharedModule,
        SalesRoutingModule,
        // MatTableExporterModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule
    ],
    providers: [],
    entryComponents: []
})

export class SalesModule { }