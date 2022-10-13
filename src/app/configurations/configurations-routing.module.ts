import { SuppliersListComponent } from './suppliers-list/suppliers-list.component';
import { Breadcrumb } from './../shared/components/breadcrumb/breadcrumb.model';
import { HqCdPriceComponent } from './hq-cd-price/hq-cd-price.component';
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { OutletPriceListComponent } from "./outlet-price-list/outlet-price-list.component";
import { ProductsListComponent } from "./products-list/products-list.component";
import { RegionListComponent } from "./region-list/region-list.component";
import { TerritoryComponent } from "./territory/territory.component";

const routes: Routes = [
    {
        path: 'list-products',
        component: ProductsListComponent,
        data: {
          breadcrumb: "All Products"
        }
      },
      {
        path: 'list-outlet-price',
        component: OutletPriceListComponent,
        data: {
          breadcrumb: "All Outlet Prices"
        }
      },
      {
        path: 'list-territory',
        component: TerritoryComponent,
        data: {
          breadcrumb: "All Territories"
        }
      },
      {
        path: 'list-regions',
        component: RegionListComponent,
        data: {
          breadcrumb: "All Regions"
        }
      },
      {
        path: 'hq-cd-prices',
        component: HqCdPriceComponent,
        data: {
          breadcrumb: "HQ-CD-Prices"
        }
      },
      {
        path: 'suppliers-list',
        component: SuppliersListComponent,
        data: {
          breadcrumb: "All Suppliers"
        }
      },
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ConfigurationsRoutingModule{}