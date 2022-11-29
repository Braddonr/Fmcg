import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { AllDistributorsComponent } from "./all-distributors/all-distributors.component";
import { AllVehiclesComponent } from "./all-vehicles/all-vehicles.component";
import { DistributorsRoutingModule } from "./distributors-routing.module";
import { VanStockListComponent } from './van-stock-list/van-stock-list.component';
import { AddDistributerComponent } from './add-distributer/add-distributer.component';
import { AddVanComponent } from './add-van/add-van.component';
import { AddVanStockComponent } from './add-van-stock/add-van-stock.component';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatTableExporterModule } from 'mat-table-exporter';
import { DialogComponent } from './dialog/dialog.component';
import { NzDropDownModule } from "ng-zorro-antd/dropdown";
import { NzMenuModule } from "ng-zorro-antd/menu";
import { NzModalModule } from "ng-zorro-antd/modal";
import { NzToolTipModule } from "ng-zorro-antd/tooltip";
import { ViewDistributorComponent } from './view-distributor/view-distributor.component';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { PendingDistributorsComponent } from './pending-distributors/pending-distributors.component';
@NgModule({
    declarations: [
        AllDistributorsComponent,
        AllVehiclesComponent,
        VanStockListComponent,
        AddDistributerComponent,
        AddVanComponent,
        AddVanStockComponent,
        DialogComponent,
        ViewDistributorComponent,
        PendingDistributorsComponent,
        
    ],
    imports: [
        CommonModule,
        SharedModule,
        DistributorsRoutingModule,
        MatInputModule,
        MatMenuModule,
        MatCheckboxModule,
        MatTableExporterModule,
        NzDropDownModule,
        NzModalModule,
        NzMenuModule,
        NzToolTipModule,
        NzDescriptionsModule,
        NzPageHeaderModule
    ],
    providers: [],
    entryComponents: []
})

export class DistributorsModule { }