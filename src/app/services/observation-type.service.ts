import { Injectable } from '@angular/core';
import { BaseService } from './base-service';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ObservationTypeService extends BaseService{
    override url = '/ObservationType';

    searchAll(data: any, all: boolean = false): Observable<any> {
      if(all)
        return this.post(`${this.url}/Search?all=true`, data);
      else
        return this.post(`${this.url}/Search`, data);
    }
}
