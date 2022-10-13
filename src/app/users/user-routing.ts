import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuditTrailComponent } from './audit-trail/audit-trail.component';
import { ListUsersComponent } from './list-users/list-users.component';
import { MyProfileComponent } from "./my-profile/my-profile.component";
import { ViewUserComponent } from './view-user/view-user.component';
import { ViewAuditTrailComponent } from './audit-trail/view-audit-trail/view-audit-trail.component';

const routes: Routes = [
    {
        path: 'list-users',
        component: ListUsersComponent,
        data: {
            title: 'List Users',
            breadcrumb: 'List Users'
        }
    },
    {
        path: 'view-user/:userName',
        component: ViewUserComponent,
        data: {
            title: 'View User'
        }
    },
    {
        path: 'audit-trail',
        component: AuditTrailComponent,
        data: {
            title: 'Audit Trail'
        }
    },
    {
        path: 'view-audit-trail/:id',
        component: ViewAuditTrailComponent,
        data: {
            title: 'View Audit Trail'
        }
    },
    {
        path: 'my-profile',
        component: MyProfileComponent,
        data: {
            title: 'My profile'
        }
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class UsersRoutingModule { }