import { Injectable } from '@angular/core';
import { BaseService } from './base-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService extends BaseService {
  override url = '/api/v2/Department';
  override search(searchData: any): Observable<any> {
    return this.get(this.url, searchData);
  }

  toggle( id:any): Observable<any> {
    return this.get(`${this.url}/${id}` );
  }
}
