import { Injectable } from '@angular/core';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root'
})
export class VisitTimeService extends BaseService {
    override url = '/VisitTime';
}
