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

    putStatus(statusId: any, status: any) {
        return this.put('/Appointment/Status/' + statusId, status);
    }

    historyAppointment(appointmentId: any) {
        return this.get('/Appointment/History/' + appointmentId);
    }
}
