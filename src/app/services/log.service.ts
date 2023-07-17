import { Injectable } from '@angular/core';
import { BaseService } from './base-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogService extends BaseService {
  override url = '/Log';
  getCaseStudyHistory(casestudyId: string) {
    return this.get(`${this.url}/Casestudy/${casestudyId}`);
  }

  getSearchLogs(data: any): Observable<any>{
    return this.post(this.url, data);
}
}
