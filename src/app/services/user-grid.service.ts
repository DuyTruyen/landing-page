import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base-service';
import { UserGrid } from '../models/user-grid.model';
import { BaseResponse } from '../models/base-respones.model';

@Injectable({
  providedIn: 'root'
})
export class UserGridService extends BaseService{

    override url = '/UserGrid';
    getUserGrid(type: number): Observable<BaseResponse> {
      return this.get(`${this.url}/${type}`);
    }
    getUserGridDefault(type: number): Observable<UserGridResponse> {
      return this.get(`${this.url}/Default/${type}`);
    }
    saveUserGrid(data: UserGrid): Observable<BaseResponse> {
      return this.post(`${this.url}`, data);
    }
}
export interface UserGridResponse extends BaseResponse {
    jsonData: UserGrid;
  }
