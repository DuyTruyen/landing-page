import { Injectable } from '@angular/core';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root'
})
export class PapsmearConfigInfoService extends BaseService {
    override url = '/PapSmearConfig/Info';
}
