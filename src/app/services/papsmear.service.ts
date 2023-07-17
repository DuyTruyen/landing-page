import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root',
})
export class PapsmearService extends BaseService {
  override url = '/PapSmear';
}
