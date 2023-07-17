import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { INIT_USER_SETTING, IUserSetting } from 'src/app/models/user-setting';

@Injectable({
  providedIn: 'root'
})
export class UserSettingStateService {
    protected subject: BehaviorSubject<IUserSetting>;
    protected userSettingStateData: IUserSetting;

  constructor() {
    this.userSettingStateData = INIT_USER_SETTING;
    this.subject = new BehaviorSubject<IUserSetting>(this.userSettingStateData);
   }
  public subscribe(callback: (model: IUserSetting) => void): Subscription {
    return this.subject.subscribe(callback);
  }

  get userSettingStateSubject()
  {
    return this.subject.asObservable()
  }

  public dispatch(payload: Partial<IUserSetting | null>): void {
    const data: Partial<IUserSetting> = payload as Partial<IUserSetting>;
    this.userSettingStateData = {...this.userSettingStateData, ...data};

    const dispatchedModel: IUserSetting = JSON.parse(JSON.stringify(this.userSettingStateData));

    this.subject.next(dispatchedModel);
  }
}
