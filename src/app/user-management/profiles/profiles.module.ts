import { AddProfilesDialogComponent } from './profiles/add-profiles-dialog/add-profiles-dialog.component';
import { AddRolesComponent } from './roles/add-roles/add-roles.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfilesRoutingModule } from './profiles-routing.module';
import { ProfilesComponent } from './profiles/profiles.component';
import { RolesComponent } from './roles/roles.component';
import { ViewComponent } from './profiles/view/view.component';
import { UsersInProfileComponent } from './profiles/view/users-in-profile/users-in-profile.component';
import { AssignRolesToProfileComponent } from './profiles/view/assign-roles-to-profile/assign-roles-to-profile.component';
import { ProfileDetailsComponent } from './profiles/view/profile-details/profile-details.component';
import { AssignUserToProfileComponent } from './profiles/view/users-in-profile/assign-user-to-profile/assign-user-to-profile.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RolesInProfileComponent } from './view/roles-in-profile/roles-in-profile.component';


@NgModule({
  declarations: [
    ProfilesComponent,
    AddRolesComponent, 
    AddProfilesDialogComponent,
    RolesComponent, ViewComponent,
    UsersInProfileComponent,
    AssignRolesToProfileComponent,
    ProfileDetailsComponent,
    AssignUserToProfileComponent,
    RolesInProfileComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ProfilesRoutingModule
  ],
  entryComponents:[
    AddRolesComponent,
    AddProfilesDialogComponent,
    AssignUserToProfileComponent
  ]
})
export class ProfilesModule { }
