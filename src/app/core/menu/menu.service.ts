import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Injectable()
export class MenuService {
  constructor(public translate: TranslateService) { }

  getAll() {
    return [
      {
        label: this.translate.instant("Dashboard"),
        icon: "dashboard",
        items: [
          { link: "dashboards/sales-analytics", label: this.translate.instant("Sales Dashboard") , icon: "crop_square"},
          {link : "", label: this.translate.instant("HQ Dashboard"), icon: "crop_square"}
        ]
      },
      {
        label: this.translate.instant("Sales"),
        icon: "dashboard",
        items: [
          { link: "/sales/all-sales", label: this.translate.instant("Sales List") , icon: "crop_square"},
          {link : "/sales/returned-items", label: this.translate.instant("Returned Items"), icon: "crop_square"},
          {link : "/sales/credit-sales", label: this.translate.instant("Credit Sales"), icon: "crop_square"}
        ]
      },

      {
        label: this.translate.instant("Distributors"),
        icon: "dashboard",
        items: [
          { link: "/distributors/all-distributors", label: this.translate.instant("Contracted Distributors") , icon: "crop_square"},
          {link : "/distributors/all-vehicles", label: this.translate.instant("Van List"), icon: "crop_square"},
          {link : "/distributors/van-stock-list", label: this.translate.instant("Van Stock List"), icon: "crop_square"}
        ]
      },

      {
        label: this.translate.instant("Cooler Module"),
        icon: "dashboard",
        items: [
          { link: "/cooler/all-coolers", label: this.translate.instant("HQ Coolers") , icon: "crop_square"},
          {link : "/cooler/coolers-allocation", label: this.translate.instant("HQ Cooler Allocation"), icon: "crop_square"},
          {link : "/", label: this.translate.instant("Depot Cooler Allocation"), icon: "crop_square"}
        ]
      },
      {
        label: this.translate.instant("Cooler Maintenance"),
        icon: "dashboard",
        items: [
          {link : "/cooler/cooler-maintenance-company", label: this.translate.instant("Cooler Companies"), icon: "crop_square"},
          { link: "/cooler/cooler-maintenance-parts", label: this.translate.instant("Cooler Parts Price") , icon: "crop_square"},
          { link: "/cooler/cooler-maintenance-technician", label: this.translate.instant("Cooler Technicians") , icon: "crop_square"}

        ]
      },
      {
        label: this.translate.instant("Outlets Module"),
        icon: "dashboard",
        items: [
          { link: "/outlets/list-outlets", label: this.translate.instant("Outlets List") , icon: "crop_square"},
          { link: "/outlets/pending-add", label: this.translate.instant("Pending Add") , icon: "crop_square"},
          
          
        ]
      },
      {
        label: this.translate.instant("Orders"),
        icon: "dashboard",
        items: [
          { link: "/orders/orders-list", label: this.translate.instant("HQ Orders List") , icon: "crop_square"},
          {link : "/", label: this.translate.instant("HQ Credit List"), icon: "crop_square"}
        ]
      },
      {
        label: this.translate.instant("Configuration"),
        icon: "dashboard",
        items: [
          { link: "/configurations/list-products", label: this.translate.instant("Product List") , icon: "crop_square"},
          {link : "/configurations/suppliers-list", label: this.translate.instant("Suppliers List"), icon: "crop_square"},
          {link : "/configurations/hq-cd-prices", label: this.translate.instant("HQ-CD Price List"), icon: "crop_square"},
          {link : "/configurations/list-outlet-price", label: this.translate.instant("CD-Outlet Price List"), icon: "crop_square"},
          {link : "/configurations/list-regions", label: this.translate.instant("Region List"), icon: "crop_square"},
          {link : "/configurations/list-territory", label: this.translate.instant("Territory List"), icon: "crop_square"},
        ]
      },
       // workflows
       {
        label: this.translate.instant("Workflow"),
        icon: 'assignment',
        items: [
          {
            label: this.translate.instant("Workflows"),
            link: 'workflow/workflows',
            icon: 'view_list'
          },
          
          {
            label: this.translate.instant("System Processes"),
            icon: 'view_list',
            items: [
              {
                label: this.translate.instant("System Category"),
                link: "workflow/system-processes/category",
                icon: 'crop_square'
              },
              {
                label: this.translate.instant("System Process"),
                link: "workflow/system-processes/process",
                icon: 'crop_square'
              }
            ]
          }
        ]
      },
      // user management
      {
        label: this.translate.instant("User Management"),
        icon: 'person',
        items: [
           // users
           {
            icon: 'view_list',
            label: this.translate.instant("Users"),
            link: "user-profile/list-users"
          },
          // profiles
          {
            label: this.translate.instant("Profiles"),
            icon: 'view_list',
            items: [
              {
                label: this.translate.instant("Profile"),
                link: "user-profile/profile/list-profiles",
                icon: 'crop_square'
              },

              {

                link: 'user-profile/profile/roles',
                icon: 'crop_square',
                label: this.translate.instant("Roles")
              }
            ]
          }

        ]
      },

     ];
  }
}
