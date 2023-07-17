import { Injectable } from '@angular/core';
import { BaseService } from "./base-service";

@Injectable({
  providedIn: 'root'
})
export class FilterRuleUserService extends BaseService{
    override url = '/GridFilter';

}
