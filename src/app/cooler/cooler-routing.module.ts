import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CompanyComponent } from "./cooler-maintenance/company/company.component";
import { PartComponent } from "./cooler-maintenance/part/part.component";
import { TechnicianComponent } from "./cooler-maintenance/technician/technician.component";
import { AllCoolersComponent } from "./cooler-parts/all-coolers/all-coolers.component";
import { HqCoolerAllocationComponent } from "./cooler-parts/hq-cooler-allocation/hq-cooler-allocation.component";
import { PendingMaintenanceComponent } from "./pending-maintenance/pending-maintenance.component";
import { PendingComponent } from "./pending/pending.component";

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
    {
        path: 'pending-coolers',
        component: PendingComponent,
        data: {
            breadcrumb: "Pending Coolers"
        }
    },

    // cooler maintenance
    {
        path: 'cooler-maintenance/company',
        component: CompanyComponent,
        data: {
            breadcrumb: "Cooler Maintenance Companies"
        }
    },
    {
        path: 'cooler-maintenance/parts',
        component: PartComponent,
        data: {
            breadcrumb: "Cooler Maintenance Parts"
        }
    },
    {
        path: 'cooler-maintenance/technician',
        component: TechnicianComponent,
        data: {
            breadcrumb: "Cooler Maintenance Technicians"
        }
    },
    {
        path: 'cooler-maintenance/pending-maintenance',
        component: PendingMaintenanceComponent,
        data: {
            breadcrumb: "Pending Maintenance"
        }
    }

    

]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class CoolerRoutingModule{}