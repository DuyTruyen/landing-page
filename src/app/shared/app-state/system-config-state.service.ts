import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { DEFAULT_SYSTEM_CONFIG, ISystemConfig } from 'src/app/models/system-config';

@Injectable({
  providedIn: 'root'
})
export class SystemConfigStateService {
    protected subject: BehaviorSubject<ISystemConfig>;
    protected systemConfigData: ISystemConfig;

  constructor() {
    this.systemConfigData = DEFAULT_SYSTEM_CONFIG;
    this.subject = new BehaviorSubject<ISystemConfig>(this.systemConfigData);
   }
  public subscribe(callback: (model: ISystemConfig) => void): Subscription {
    return this.subject.subscribe(callback);
  }

  public dispatch(payload: any | null): void {
    const data: Partial<ISystemConfig> = payload as Partial<ISystemConfig>;
    this.systemConfigData = {...this.systemConfigData, ...data};

    const dispatchedModel: ISystemConfig = JSON.parse(JSON.stringify(this.systemConfigData));

    this.subject.next(dispatchedModel);
  }
}
