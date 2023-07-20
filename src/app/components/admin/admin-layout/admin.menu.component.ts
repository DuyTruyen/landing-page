import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { IAuthModel, INIT_AUTH_MODEL } from 'src/app/models/auth-model';
import { AuthStateService } from 'src/app/shared/app-state/auth-state.service';
import { Roles } from 'src/app/shared/constants/constants';

@Component({
    selector: 'admin-menu',
    templateUrl: './admin.menu.component.html'
})
export class AdminMenuComponent implements OnInit {
    protected _authSubscription: Subscription;
    currentUser = INIT_AUTH_MODEL;

    model: any[] = [];

    constructor(
        private authState: AuthStateService,
    ) {
        this._authSubscription = this.authState.subscribe((m: IAuthModel) => {
            this.currentUser = m;
        });
    }

    ngOnInit() {
        this.model = [
            {
                label: 'Quản lý hệ thống',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Quản lý user',
                        icon: 'pi pi-fw pi-user',
                        visible: this.currentUser.menus?.includes(Roles.MANAGE_USER),
                        items: [
                            {
                                label: 'Danh sách user',
                                icon: 'pi pi-fw pi-user',
                                routerLink: ['/users'],
                            },
                            {
                                label: 'Xem phân quyền user',
                                icon: 'pi pi-fw pi-user',
                                routerLink: ['/user-roles']
                            },
                        ]
                    },
                    {
                        label: 'Quản lý group',
                        icon: 'pi pi-fw pi-users',
                        visible: this.currentUser.menus?.includes(Roles.MANAGE_GROUP),
                        items: [
                            {
                                label: 'Danh sách group',
                                icon: 'pi pi-fw pi-users',
                                routerLink: ['/user-groups']
                            },
                            {
                                label: 'Phân quyền group',
                                icon: 'pi pi-fw pi-users',
                                routerLink: ['/group-roles']
                            },
                        ]
                    },
                ]
            },
        ];
    }

    public ngOnDestroy(): void {
        this._authSubscription.unsubscribe();
    }
}
