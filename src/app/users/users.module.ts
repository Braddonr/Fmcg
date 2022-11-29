
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
// import { ToastrModule } from 'ngx-toastr'; 


import { UsersRoutingModule } from './user-routing';
import { ListUsersComponent } from './list-users/list-users.component';
import { AuditTrailComponent } from './audit-trail/audit-trail.component';
import { AddUserComponent } from './add-user/add-user.component';
import { ViewUserComponent } from './view-user/view-user.component';
import { ApprovalDialogComponent } from './pending-approval/approval-dialog/approval-dialog.component';
import { UserAuditTrailComponent } from './view-user/user-audit-trail/user-audit-trail.component';
import { UserProfilesComponent } from './view-user/user-profiles/user-profiles.component';
import { EditUserComponent } from './view-user/edit-user/edit-user.component';
import { AssignProfileComponent } from './assign-profile/assign-profile.component';
import { ApprovalDetailsComponent } from './pending-approval/approval-details/approval-details.component';
import { ViewAuditTrailComponent } from './audit-trail/view-audit-trail/view-audit-trail.component';
import { BlockUnblockComponent } from './block-unblock/block-unblock.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { MyRolesComponent } from './my-profile/my-roles/my-roles.component';
import { MatTableExporterModule } from 'mat-table-exporter';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { UserDetailsComponent } from './user-details/user-details.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { ProfilesComponent } from './profiles/profiles.component';

@NgModule({
  declarations: [
    ListUsersComponent,
    AuditTrailComponent,
    AddUserComponent,
    ViewUserComponent,
    ApprovalDialogComponent,
    UserAuditTrailComponent,
    UserProfilesComponent,
    EditUserComponent,
    AssignProfileComponent,
    ApprovalDetailsComponent,
    ViewAuditTrailComponent,
    BlockUnblockComponent,
    MyProfileComponent,
    MyRolesComponent,
    UserDetailsComponent,
    ProfilesComponent,
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule,
    MatTableExporterModule,
    NzDropDownModule,
    NzMenuModule,
    NzModalModule,
    NzToolTipModule,
    NzSpaceModule,
    NzTagModule,
    NzInputModule,
    NzDescriptionsModule,
    NzListModule,
    NzTabsModule,
    NzBadgeModule,
    NzPageHeaderModule
  ],
  
})
export class UsersModule { }
