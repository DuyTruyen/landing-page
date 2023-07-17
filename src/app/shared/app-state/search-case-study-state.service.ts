import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { INIT_SEARCH_CASE_STUDY, RoleFilter, SearchCaseStudy } from 'src/app/models/search-case-study';
import { UserSettingStateService } from './user-setting-state.service';
import { INIT_USER_SETTING, IUserSetting } from 'src/app/models/user-setting';
import { distinctUntilChanged, map } from 'rxjs/operators';
import Utils from '../helpers/utils';

@Injectable({
  providedIn: 'root',
})
export class SearchCaseStudyStateService {
  protected subject: BehaviorSubject<SearchCaseStudy>;
  protected exportMultipleReportsSubject: BehaviorSubject<SearchCaseStudy>;
  searchCaseStudyData: SearchCaseStudy;
  _userSettingSub: Subscription;
  userSetting: IUserSetting = INIT_USER_SETTING;
  userSettingFilter = { roleFilter1: {}, roleFilter2: {}, roleSort1: {}, roleSort2: {}, branchId: '' };

  constructor(private userSettingsStateService: UserSettingStateService) {
    this.searchCaseStudyData = INIT_SEARCH_CASE_STUDY;
    this.subject = new BehaviorSubject<SearchCaseStudy>(this.searchCaseStudyData);
    this.exportMultipleReportsSubject = new BehaviorSubject<SearchCaseStudy>(this.searchCaseStudyData);
    this._userSettingSub = this.userSettingsStateService.userSettingStateSubject
      .pipe(
        map((response: any) => ({
          roleFilter1: response.roleFilter1,
          roleFilter2: response.roleFilter2,
          roleSort1: response.roleSort1,
          roleSort2: response.roleSort2,
          branchId: response.branchId,
        })),
      )
      .subscribe((res) => {
        if (!Utils.compareObject(this.userSettingFilter.roleFilter1, res.roleFilter1) || !Utils.compareObject(this.userSettingFilter.roleFilter2, res.roleFilter2) || !Utils.compareObject(this.userSettingFilter.roleSort1, res.roleSort1) || !Utils.compareObject(this.userSettingFilter.roleSort2, res.roleSort2) || this.userSettingFilter.branchId != res.branchId) {
          this.userSettingFilter = res;
          this.searchCaseStudyData = structuredClone(INIT_SEARCH_CASE_STUDY);
          this.resetDefaultSearchValue(res);
          const dispatchedModel: SearchCaseStudy = JSON.parse(JSON.stringify({ ...this.searchCaseStudyData, branchId: res.branchId }));
          this.subject.next(dispatchedModel);
        }
      });
  }
  public subscribe(callback: (model: SearchCaseStudy) => void): Subscription {
    return this.subject.subscribe(callback);
  }

  public dispatchExportMultipleReports(payload: any | null): void {
    const data: Partial<SearchCaseStudy> = payload as Partial<SearchCaseStudy>;
    this.searchCaseStudyData = { ...this.searchCaseStudyData, ...data };
    const dispatchedModel: SearchCaseStudy = JSON.parse(JSON.stringify(this.searchCaseStudyData));
    this.exportMultipleReportsSubject.next(dispatchedModel);
  }
  public subscribeExportMultipleReports(callback: (model: SearchCaseStudy) => void): Subscription {
    return this.exportMultipleReportsSubject.subscribe(callback);
  }

  public dispatch(payload: any | null): void {
    const data: Partial<SearchCaseStudy> = payload as Partial<SearchCaseStudy>;
    this.searchCaseStudyData = { ...this.searchCaseStudyData, ...data };
    const dispatchedModel: SearchCaseStudy = JSON.parse(JSON.stringify(this.searchCaseStudyData));
    this.subject.next(dispatchedModel);
  }

  resetDefaultSearchValue(userSettingFilter: any) {
    this.setFilterValue(userSettingFilter.roleFilter1);
    this.setFilterValue(userSettingFilter.roleFilter2);
    if (userSettingFilter.roleSort1 != null && userSettingFilter.roleSort1.field) {
      let data = { field: userSettingFilter.roleSort1.field, dir: userSettingFilter.roleSort1.value };
      this.searchCaseStudyData.sort[0] = data;
    }
    if (userSettingFilter.roleSort2 != null && userSettingFilter.roleSort2.field) {
      let data = { field: userSettingFilter.roleSort2.field, dir: userSettingFilter.roleSort2.value };
      this.searchCaseStudyData.sort[1] = data;
    }
  }

  setFilterValue(userSettingFilter: RoleFilter) {
    if (userSettingFilter != null) {
      if (userSettingFilter.field == 'from' || userSettingFilter.field == 'to') {
        this.searchCaseStudyData[userSettingFilter.field] = this.setFilterDateValue(userSettingFilter.value);
      } else {
        this.searchCaseStudyData[userSettingFilter.field] = userSettingFilter.value;
      }
    }
  }

  setFilterDateValue(value: string) {
    let today = new Date().setHours(0, 0, 0, 0);
    var date = new Date(today);
    var dateNum = 0;
    switch (value) {
      case '1':
        return date;
      case '3':
        dateNum = date.setDate(date.getDate() - 3);
        break;
      case '7':
        dateNum = this.getMonday(date);
        break;
      case '10':
        dateNum = date.setDate(1);
        break;
    }
    return new Date(dateNum);
  }

  getMonday(d: Date): number {
    var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    return d.setDate(diff);
  }
}
