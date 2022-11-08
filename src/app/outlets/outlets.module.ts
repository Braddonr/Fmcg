import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { OutletsListComponent } from './outlets-list/outlets-list.component';
import { OutletsRoutingModule } from "./outlets-routing.module";
import { AddOutletComponent } from './add-outlet/add-outlet.component';
import { ViewOutletsComponent } from './view-outlets/view-outlets.component';
import { MatInputModule } from "@angular/material/input";
import { MatTableExporterModule } from "mat-table-exporter";
import { DialogComponent } from './dialog/dialog.component';
import { MatFormFieldModule } from "@angular/material/form-field";
import { TablefiltersPipe } from "../shared/pipes/tablefilters.pipe";
import { PendingAddComponent } from './pending-add/pending-add.component';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDropDownModule } from "ng-zorro-antd/dropdown";
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { AgmCoreModule } from '@agm/core';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzResultModule } from 'ng-zorro-antd/result';


@NgModule({
    declarations: [
    OutletsListComponent,
    AddOutletComponent,
    ViewOutletsComponent,
    DialogComponent,
    TablefiltersPipe,
    PendingAddComponent,
],
    imports: [
        CommonModule,
        SharedModule,
        OutletsRoutingModule,
        MatInputModule,
        MatTableExporterModule,
        MatFormFieldModule,
        NzSpaceModule,
        NzButtonModule,
        NzModalModule,
        NzDropDownModule,
        NzDatePickerModule,
        NzToolTipModule,
        NzDescriptionsModule,
        NzGridModule,
        NzPageHeaderModule,
        NzResultModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyCeXaOKfJXQZuh-3wZmMmYSt5NruUJPVgU',
          })
    ],
    providers: [],
    entryComponents: []
})

export class OutletsModule { }