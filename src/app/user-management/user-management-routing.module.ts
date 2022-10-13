import { ViewComponent } from './system-users/view/view.component';
import { SystemUsersComponent } from './system-users/system-users.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfilesComponent } from './profiles/profiles/profiles.component';

const routes: Routes = [
 
  // {
  //   path: 'edit-user',
  //   component: SystemUsersComponent
  // },
  {
    path: 'profile',
   loadChildren: ()=>
   import("./profiles/profiles.module").then(m => m.ProfilesModule),
   data: {
     breadcrumb: "Profiles"
   }
  },
  // {
  //   path:'tellers',
  //   component: ManageTellersComponent
  // },
  {
    path: 'list-users',
    component: SystemUsersComponent,
    data: {
      breadcrumb: "All Users"
    }
  },
  
  {
    path: 'list-users/:id',
    component: ViewComponent
  },
  
  // {
  //   path:'teller/:id',
  //   component: ViewTellerComponent
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule { }
