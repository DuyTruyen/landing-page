import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService extends BaseService {
  override url = '/api/v2/File/Upload';
  upload(fileParam: any): Observable<any> {
    let file = new Blob([fileParam], { type: fileParam.type })
    const formData: FormData = new FormData();
    formData.append('file', file, fileParam.name);

    return this.post(`${this.url}`, formData);
  }
}
