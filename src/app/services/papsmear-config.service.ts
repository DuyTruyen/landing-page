import { Injectable } from '@angular/core';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root'
})
export class PapsmearConfigService extends BaseService {
    override url = '/PapSmearConfig';
}
