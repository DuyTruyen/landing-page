import { Injectable } from '@angular/core';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root'
})
export class SystemConfigService extends BaseService {
    override url = '/SystemConfig';
}
