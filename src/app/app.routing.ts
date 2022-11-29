import { AdminLayoutComponent, AuthLayoutComponent } from "./core";

import { Routes } from "@angular/router";
import { AuthGuardService } from "./shared/services/auth-guard.service";

export const AppRoutes: Routes = [
  {
    path: "",
    redirectTo:"dashboards/sales-analytics",
    pathMatch: 'full'
  },
  
  {
    path: "",
    component: AdminLayoutComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: "dashboards",
        loadChildren: () =>
          import("./dashboard/dashboard.module").then(m => m.DashboardModule),
          data: {
            breadcrumb: "Dashboard"
          }
      },    
      {
        path:'workflow',
        loadChildren: ()=>
        import("./workflow/workflow.module").then(m => m.WorkflowModule),
        data: {
          breadcrumb: "Workflow"
        }
      },
      // {
      //   path: 'user-profile',
      //   loadChildren: () => 
      //   import('./user-management/user-management.module').then(m => m.UserManagementModule),
      //   data: {
      //     breadcrumb: "User Profile"
      //   }
      // },  
      
      {
        path: 'user-management',
        loadChildren: () => 
        import('./users/users.module').then(m => m.UsersModule),
        data: {
          breadcrumb: "User Management"
        }
      },  
      {
        path: "charts",
        loadChildren: () =>
          import("./chartlib/chartlib.module").then(m => m.ChartlibModule),
        data: {
          breadcrumb: "Charts"
        }
      },
      {
        path: "maps",
        loadChildren: () => import("./maps/maps.module").then(m => m.MapModule),
        data: {
          breadcrumb: "Maps"
        }
      },
  
      {
        path: "pages",
        loadChildren: () =>
          import("./pages/pages.module").then(m => m.PagesModule),
          data: {
            breadcrumb: "Pages"
          }
      },
      {
        path: "configurations",
        loadChildren: () =>
          import("./configurations/configurations.module").then(m => m.ConfigurationsModule),
          data: {
            breadcrumb: "Configurations"
          }
      },
      {
        path:"cooler",
        loadChildren: () => 
        import("./cooler/cooler.module").then(m=> m.CoolerModule),
        data: {
          breadcrumb: "Coolers"
        }
      },
      {
        path:"distributors",
        loadChildren: () => 
        import("./distributors/distributors.module").then(m=> m.DistributorsModule),
        data: {
          breadcrumb: "Distributors"
        }
      },
      {
        path:"orders",
        loadChildren: () => 
        import("./orders/orders.module").then(m=> m.OrdersModule),
        data: {
          breadcrumb: "Orders"
        }
      },
      {
        path:"outlets",
        loadChildren: () => 
        import("./outlets/outlets.module").then(m=> m.OutletsModule),
        data: {
          breadcrumb: "Outlets"
        }
      },
      {
        path:"sales",
        loadChildren: () => 
        import("./sales/sales.module").then(m=> m.SalesModule),
        data: {
          breadcrumb: "Sales"
        }
      }
    ]
  },

  // auth
  {
    path: "auth",
    loadChildren:() => 
    import("./auth/auth.module").then(m => m.AuthModule)
  },
  // end of auth
  {
    path: "",
    component: AuthLayoutComponent,
    children: [
      {
        path: "session",
        loadChildren: () =>
          import("./session/session.module").then(m => m.SessionModule)
      }
    ]
  },
  // {
  //   path: "**",
  //   redirectTo: "session/404"
  // }
];
