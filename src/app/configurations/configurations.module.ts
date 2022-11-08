import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { ConfigurationsRoutingModule } from "./configurations-routing.module";
import { ProductsListComponent } from './products-list/products-list.component';
import { OutletPriceListComponent } from './outlet-price-list/outlet-price-list.component';
import { RegionListComponent } from './region-list/region-list.component';
import { TerritoryComponent } from './territory/territory.component';
import { HqCdPriceComponent } from './hq-cd-price/hq-cd-price.component';
import { SuppliersListComponent } from './suppliers-list/suppliers-list.component';
import { AddProductComponent } from './add-product/add-product.component';
import { AddPriceComponent } from './add-price/add-price.component';
import { AddOutletPriceComponent } from './add-outlet-price/add-outlet-price.component';
import { AddRegionComponent } from './add-region/add-region.component';
import { AddTerritoryComponent } from './add-territory/add-territory.component';
import { MatInputModule } from "@angular/material/input";
import { MatTableExporterModule } from 'mat-table-exporter';
import { DialogComponent } from './dialog/dialog.component';
import { NzModalModule } from "ng-zorro-antd/modal";
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@NgModule({
    declarations: [
    ProductsListComponent,
    OutletPriceListComponent,
    RegionListComponent,
    TerritoryComponent,
    HqCdPriceComponent,
    SuppliersListComponent,
    AddProductComponent,
    AddPriceComponent,
    AddOutletPriceComponent,
    AddRegionComponent,
    AddTerritoryComponent,
    DialogComponent,
],
    imports: [
        CommonModule,
        SharedModule,
        ConfigurationsRoutingModule,
        MatInputModule,
        MatTableExporterModule,
        NzModalModule,
        NzToolTipModule
    ],
    providers: [],
    entryComponents: []
})

export class ConfigurationsModule{}