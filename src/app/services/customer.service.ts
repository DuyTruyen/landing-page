import { Injectable } from '@angular/core';
import { BaseService } from './base-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService extends BaseService {
  override url = '/Customer';
  override search(searchData: any): Observable<any> {
    return this.get(this.url, searchData);
  }
  getInfo(code:any):Observable<any>{
    return this.get(`${this.url}/CheckInfo/${code}`);
  }
  sync(code:any,id:any):Observable<any>{
    return this.get(`${this.url}/Sync/${code}/${id}`);
  }
  getSession(id:any):Observable<any>{
    return this.get(`${this.url}/GetVisits/${id}`);
  }
}
