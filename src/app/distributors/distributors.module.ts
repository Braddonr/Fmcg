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

@NgModule({
    declarations: [
        AllDistributorsComponent,
        AllVehiclesComponent,
        VanStockListComponent,
        AddDistributerComponent,
        AddVanComponent,
        AddVanStockComponent,
        DialogComponent,
        
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
        NzMenuModule
    ],
    providers: [],
    entryComponents: []
})

export class DistributorsModule { }