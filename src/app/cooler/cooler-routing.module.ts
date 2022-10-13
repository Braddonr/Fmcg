import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CompanyComponent } from "./cooler-maintenance/company/company.component";
import { PartComponent } from "./cooler-maintenance/part/part.component";
import { TechnicianComponent } from "./cooler-maintenance/technician/technician.component";
import { AllCoolersComponent } from "./cooler-parts/all-coolers/all-coolers.component";
import { HqCoolerAllocationComponent } from "./cooler-parts/hq-cooler-allocation/hq-cooler-allocation.component";

const routes:Routes = [

    // coolers
    {
        path: 'all-coolers',
        component: AllCoolersComponent,
        data: {
            breadcrumb: "All Coolers"
        }
    },
    {
        path: 'coolers-allocation',
        component: HqCoolerAllocationComponent,
        data: {
            breadcrumb: "Coolers Allocation"
        }
    },

    // cooler maintenance
    {
        path: 'cooler-maintenance-company',
        component: CompanyComponent,
        data: {
            breadcrumb: "Cooler Maintenance Companies"
        }
    },
    {
        path: 'cooler-maintenance-parts',
        component: PartComponent,
        data: {
            breadcrumb: "Cooler Maintenance Parts"
        }
    },
    {
        path: 'cooler-maintenance-technician',
        component: TechnicianComponent,
        data: {
            breadcrumb: "Cooler Maintenance Technicians"
        }
    }

    

]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class CoolerRoutingModule{}