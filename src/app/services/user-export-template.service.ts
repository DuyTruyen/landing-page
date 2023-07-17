import { Injectable } from '@angular/core';
import { BaseService } from './base-service';
import {BaseResponse} from "../models/base-respones.model";
import { NameTemplate } from "../models/user-export-template";
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserExportTemplateService extends BaseService{
    override url = '/UserExportTemplate';

    getUserExportTemplateType(type: number): Observable<BaseResponse>{
        return this.get(`${this.url}/Type/${type}`);
    }
    createCustomTemplate(data: NameTemplate): Observable<BaseResponse>{
        return this.post(`${this.url}`, data);
    }
    getCustomTemplateId(templateId: string): Observable<BaseResponse>{
        return this.get(`${this.url}/${templateId}`);
    }
}


export interface UserExportTemplate extends BaseResponse {
    jsonData: NameTemplate;
}
