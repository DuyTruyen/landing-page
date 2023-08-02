import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/shared/auth-guard.service';
import { Roles } from 'src/app/shared/constants/constants';
import { AdminLayoutComponent } from './admin.layout.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AdminLayoutComponent,
                children: [
                    {
                        path: 'users',
                        loadChildren: () =>
                            import('../list-users/list-users.module').then(
                                (m) => m.ListUsersModule
                            ),
                        canActivate: [AuthGuard],
                        data: { role: Roles.MANAGE_USER },
                    },
                    {
                        path: 'user-roles',
                        loadChildren: () =>
                            import('../user-roles/user-roles.module').then(
                                (m) => m.UserRolesModule
                            ),
                        canActivate: [AuthGuard],
                        data: { role: Roles.MANAGE_USER },
                    },
                    {
                        path: 'user-groups',
                        loadChildren: () =>
                            import('../user-groups/user-groups.module').then(
                                (m) => m.UserGroupsModule
                            ),
                        canActivate: [AuthGuard],
                        data: { role: Roles.MANAGE_GROUP },
                    },
                    {
                        path: 'group-roles',
                        loadChildren: () =>
                            import('../group-roles/group-roles.module').then(
                                (m) => m.GroupRolesModule
                            ),
                        canActivate: [AuthGuard],
                        data: { role: Roles.MANAGE_GROUP },
                    },
                    {
                        path: 'visit-time',
                        loadChildren: () =>
                            import('../visit-time/visit-time.module').then(
                                (m) => m.VisitTimeModule
                            ),
                        canActivate: [AuthGuard],
                        // data: { role: Roles.MANAGE_GROUP },
                    },
                    {
                        path: 'admin-dashboard',
                        loadChildren: () =>
                            import('../admin-dashboard/admin-dashboard.module').then(
                                (m) => m.AdminDashboardModule
                            )

                    },
                    { path: '', redirectTo: 'admin-dashboard', pathMatch: 'full'},

                ],
            },
        ]),
    ],
    exports: [RouterModule],
})
export class AdminLayoutRoutingModule { }
