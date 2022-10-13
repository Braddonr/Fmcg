import { RolesComponent } from './roles/roles.component';
// import { ProfileComponent } from './../account-settings/profile/profile.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfilesComponent } from './profiles/profiles.component';
import { ViewComponent } from './profiles/view/view.component';


const routes: Routes = [
  {
    path:'profile/list-profiles',
    component: ProfilesComponent,
    data: {
      breadcrumb: "Profiles list"
    }
  },
  {
    path:'view',
    component: ViewComponent,
    data: {
      breadcrumb: "View single profile"
    }
  },
  {
    path:'profile/roles',
    component: RolesComponent,
    data: {
      breadcrumb: "Roles list"
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfilesRoutingModule { }
