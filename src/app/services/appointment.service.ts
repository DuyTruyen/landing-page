import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService extends BaseService {
    override url = '/Appointment';

    getAppointment(data: any): Observable<any> {
        return this.get(this.url, data);
    }

    putStatus(statusId: number) {
        return this.put(`${this.url}/Status/${statusId}`, '')
    }
}
