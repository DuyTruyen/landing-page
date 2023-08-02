import { Injectable } from '@angular/core';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService extends BaseService {
  override url = '/Customer';
}
