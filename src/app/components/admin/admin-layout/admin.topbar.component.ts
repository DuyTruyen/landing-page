import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { IAuthModel, INIT_AUTH_MODEL } from 'src/app/models/auth-model';
import { AuthService } from 'src/app/services/auth.service';
import { AuthStateService } from 'src/app/shared/app-state/auth-state.service';
import { StorageKeys } from 'src/app/shared/constants/constants';
import { AdminLayoutService } from './service/admin.layout.service';
import { UserSettingStateService } from 'src/app/shared/app-state/user-setting-state.service';
import { SystemConfigStateService } from 'src/app/shared/app-state/system-config-state.service';
import { SearchCaseStudyStateService } from 'src/app/shared/app-state/search-case-study-state.service';
import { INIT_USER_SETTING } from 'src/app/models/user-setting';
import { DEFAULT_SYSTEM_CONFIG } from 'src/app/models/system-config';
import { INIT_SEARCH_CASE_STUDY } from 'src/app/models/search-case-study';

@Component({
  selector: 'admin-topbar',
  templateUrl: './admin.topbar.component.html',
})
export class AdminTopBarComponent {
  profileMenuItems!: MenuItem[];

  @ViewChild('menubutton') menuButton!: ElementRef;

  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  @ViewChild('topbarmenu') menu!: ElementRef;
  protected _authSubscription: Subscription;
  currentUser = INIT_AUTH_MODEL;

  constructor(public layoutService: AdminLayoutService, private router: Router, private authState: AuthStateService, private authService: AuthService, private userSettingsStateService: UserSettingStateService, private systemConfigState: SystemConfigStateService, private searchCaseStudyStateService: SearchCaseStudyStateService) {
    this.profileMenuItems = [
      {
        label: 'Trang chủ',
        icon: 'pi pi-fw pi-home',
        routerLink: '/',
      },
      {
        separator: true,
      },
      {
        label: 'Đăng xuất',
        icon: 'pi pi-fw pi-power-off',
        command: () => this.signOut(),
      },
    ];
    this._authSubscription = this.authState.subscribe((m: IAuthModel) => {
      this.currentUser = m;
    });
  }

  signOut() {
    this.authService
      .logout()
      .subscribe((data) => {})
      .add(() => {
        localStorage.removeItem(StorageKeys.TOKEN);
        localStorage.removeItem(StorageKeys.USER);
        this.authState.dispatch(null);
        this.userSettingsStateService.dispatch(INIT_USER_SETTING);
        this.systemConfigState.dispatch(DEFAULT_SYSTEM_CONFIG);
        this.searchCaseStudyStateService.dispatch(INIT_SEARCH_CASE_STUDY);
        this.router.navigate(['/login']);
      });
  }

  public ngOnDestroy(): void {
    this._authSubscription.unsubscribe();
  }
}
