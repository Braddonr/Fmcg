import { ViewAuditTrailComponent } from './system-users/view/audit-trail/view-audit-trail/view-audit-trail.component';
import { AuditTrailListComponent } from './system-users/view/audit-trail/audit-trail-list/audit-trail-list.component';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import {MatInputModule} from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field';

import { UserManagementRoutingModule } from './user-management-routing.module';
import { SystemUsersComponent } from './system-users/system-users.component';
import { AddUserDialogComponent } from './system-users/add-user-dialog/add-user-dialog.component';
import { ViewComponent } from './system-users/view/view.component';
import { ListUserDetailsComponent } from './system-users/view/list-user-details/list-user-details.component';
import { ProfilesModule } from './profiles/profiles.module';
import { ResetPasswordComponent } from './system-users/view/reset-password/reset-password.component';



@NgModule({
  
  declarations: [
    SystemUsersComponent, 
    AddUserDialogComponent, 
    ViewComponent, 
    ListUserDetailsComponent, 
    AuditTrailListComponent,
    ViewAuditTrailComponent,
    ResetPasswordComponent,
   

  
  ],
  imports: [
    CommonModule,
    MatInputModule,
    SharedModule,
    NgbModule,
    MatFormFieldModule,
    ProfilesModule,
    // FlxUiDatatableModule,
    UserManagementRoutingModule
  ],
  providers:[
    // FlxUiDataTable
  ],
   entryComponents:[
     AddUserDialogComponent,
     ViewAuditTrailComponent
   
   ]
})
export class UserManagementModule { }
