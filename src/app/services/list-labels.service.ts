import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base-service';

@Injectable({
    providedIn: 'root',
})
export class ListLabelsService extends BaseService {
    override url = '/Label';

    getEnabledLabel(): Observable<any> {
        return this.get(`${this.url}/Enable`);
    }
}
