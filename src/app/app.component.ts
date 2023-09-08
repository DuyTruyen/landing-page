import { Component } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { AppConfigService } from './shared/app-config.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { AuthStateService } from './shared/app-state/auth-state.service';
import { INIT_AUTH_MODEL } from './models/auth-model';
import { NotificationService } from './shared/notification.service';
import { StorageKeys } from './shared/constants/constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private primengConfig: PrimeNGConfig, public configService: AppConfigService, private translateService: TranslateService, private authService: AuthService, private router: Router, private authStateService: AuthStateService, private notify: NotificationService) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.translateService.setDefaultLang('vi');
    this.validateToken();
  }

  ngAfterViewInit() {
    // console.log('lang ');
    this.translateService.use('vi');
    this.translateService.get('primeng').subscribe((res) => this.primengConfig.setTranslation(res));
  }

  translate(lang: string) {
    this.translateService.use(lang);
    this.translateService.get('primeng').subscribe((res) => this.primengConfig.setTranslation(res));
  }
  validateToken() {
    let localAuthData = localStorage.getItem(StorageKeys.USER);
    if (localAuthData) {
      this.authService.validate().subscribe({
        next: (res) => {
          if (res.token) {
            this.authStateService.dispatch(res);
            localStorage.setItem(StorageKeys.USER, JSON.stringify(res));
            localStorage.setItem(StorageKeys.TOKEN, res.token);
          } else {
            this.handleTokenExpried();
          }
        },
        error: (err) => {
          this.handleTokenExpried();
        },
      });
    }
  }
  handleTokenExpried() {
    this.notify.error('Phiên đăng nhập hết hạn');
    localStorage.clear();
    this.router.navigate(['login']);
    this.authStateService.dispatch(INIT_AUTH_MODEL);
  }
}
