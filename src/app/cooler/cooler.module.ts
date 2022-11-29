import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { CompanyComponent } from './cooler-maintenance/company/company.component';
import { PartComponent } from './cooler-maintenance/part/part.component';
import { TechnicianComponent } from './cooler-maintenance/technician/technician.component';
import { AllCoolersComponent } from './cooler-parts/all-coolers/all-coolers.component';
import { HqCoolerAllocationComponent } from './cooler-parts/hq-cooler-allocation/hq-cooler-allocation.component';
import { CoolerRoutingModule } from "./cooler-routing.module";
import { AddCoolerComponent } from './cooler-parts/add-cooler/add-cooler.component';
import { AddCompanyComponent } from './cooler-maintenance/add-company/add-company.component';
import { AddSparePartComponent } from './cooler-maintenance/add-spare-part/add-spare-part.component';
import { MatInputModule } from "@angular/material/input";
import { MatTableExporterModule } from "mat-table-exporter";
import { DialogComponent } from "./dialog/dialog.component";
import { NzDropDownModule } from "ng-zorro-antd/dropdown";
import { NzMenuModule } from "ng-zorro-antd/menu";
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzToolTipModule } from "ng-zorro-antd/tooltip";
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { PendingComponent } from './pending/pending.component';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { PendingMaintenanceComponent } from './pending-maintenance/pending-maintenance.component';

@NgModule({
    declarations: [
        CompanyComponent, 
        PartComponent, 
        TechnicianComponent, 
        AllCoolersComponent, 
        HqCoolerAllocationComponent, 
        AddCoolerComponent, 
        AddCompanyComponent, 
        AddSparePartComponent,
        DialogComponent,
        PendingComponent,
        PendingMaintenanceComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        CoolerRoutingModule,
        MatInputModule,
        MatTableExporterModule,
        NzDropDownModule,
        NzMenuModule,
        NzModalModule,
        NzToolTipModule,
        NzTabsModule,
        NzSpaceModule
    ],
    providers: [],
    entryComponents:[]
})

export class CoolerModule{}