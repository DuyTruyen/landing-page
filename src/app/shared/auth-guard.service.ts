import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Subscription } from 'rxjs';
import { IAuthModel, INIT_AUTH_MODEL } from '../models/auth-model';
import { AuthStateService } from './app-state/auth-state.service';
import { NotificationService } from './notification.service';
import { StorageKeys } from './constants/constants';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, OnDestroy {
  protected _authSubscription: Subscription;
  currentUser = INIT_AUTH_MODEL;

  constructor(private router: Router, private notification: NotificationService, private authState: AuthStateService) {
    this._authSubscription = this.authState.subscribe((m: IAuthModel) => {
      this.currentUser = m;
    });
  }

  public ngOnDestroy(): void {
    this._authSubscription.unsubscribe();
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const token = localStorage.getItem(StorageKeys.TOKEN);
    if (route.data['role']) {
      if (this.currentUser.roles?.includes(route.data['role'])) {
        return true;
      }
    } else if (state.url.includes('login')) {
      if (token) {
        return false;
      } else {
        return true;
      }
    } else if (this.currentUser.id) {
      return true;
    } else if (state.url.includes('share/')) {
      return true;
    }
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
