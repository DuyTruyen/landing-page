import { Injectable } from '@angular/core';
import { BaseService } from './base-service';
@Injectable({
  providedIn: 'root'
})
export class OtGroupService extends BaseService{
    override url = '/OTGroup';

}
