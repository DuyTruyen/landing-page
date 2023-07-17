import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { AppConfig } from '../models/app-config';
import { Observable } from 'rxjs';
import { UserSettingStateService } from './app-state/user-setting-state.service';
import { SystemConfigStateService } from './app-state/system-config-state.service';
import { StorageKeys } from './constants/constants';
import { NotificationService } from './notification.service';

@Injectable({
    providedIn: 'root',
})
export class AppConfigService {
    private config = new AppConfig();
    private options = {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            DataType: 'application/json',
        },
    };

    constructor(
        private http: HttpClient,
        private userSettingStateService: UserSettingStateService,
        private systemConfigState: SystemConfigStateService,
        private notification: NotificationService,
    ) {}

    load() {
        return new Promise((resolve, reject) => {
            this.http
                .get(
                    `../../assets/config/${environment.env}.json`,
                    this.options
                )
                .subscribe({
                    next: (data: any) => {
                        this.setConfig(data);
                        this.loadOtherConfig(resolve);
                    },
                    error: (error) => {
                        console.log('error', error);
                        throw new Error(error.message || 'Server Error');
                    },
                });
        });
    }

    private setConfig = (data: any): void => {
        this.config.api.baseUrl = 'https://' + data.api.baseUrl;
        this.config.api.fileUrl = 'https://' + data.api.fileUrl;
        this.config.deepzoom.baseUrl = 'https://' + data.deepzoom.baseUrl;
        this.config.domain = data.domain;
        this.config.sharedUrl = `https://${data.domain}/${data.sharedUrl}`;
        this.config.layout = data.layout;
        this.config.slogan = data.slogan;
        this.config.isEnablePapsmear = data.isEnablePapsmear;
        this.config.initData = data.initData;
        Object.assign(this.config.viewerConfig, data.viewerConfig);
    };

    getConfig = () => this.config;

    public loadOtherConfig = (callback: Function | null) => {
        if(!localStorage.getItem(StorageKeys.TOKEN) || !localStorage.getItem(StorageKeys.USER)){
            if (callback) callback(true); return}
        const systemConfig$: Observable<any> = this.http.get(
            this.config.api.baseUrl + '/SystemConfig',
            this.options
        );
        const userSetting$: Observable<any> = this.http.get(
            this.config.api.baseUrl + '/UserSettings',
            this.options
        );
        forkJoin({ systemConfig$, userSetting$ }).subscribe({
            next: ({ systemConfig$, userSetting$ }) => {
                if (systemConfig$.isValid && userSetting$.isValid) {
                    this.systemConfigState.dispatch(systemConfig$.jsonData);
                    this.userSettingStateService.dispatch(userSetting$.jsonData);
                }
                else{
                    this.notification.error('Không thể tải cấu hình hệ thống xin vui lòng liên hệ quản trị viên!','');
                }
            },
            error: (err)=>{
                this.notification.error('Không thể tải cấu hình hệ thống xin vui lòng liên hệ quản trị viên!','');
            },

        }).add(()=>{
            if (callback) callback(true);
        });
    };
}
