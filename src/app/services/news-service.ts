import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root'
})
export class NewService extends BaseService {
  override url = '/api/v2/News';
  getNews(data: any): Observable<any> {
    return this.get(this.url, data);
  }
  
}
