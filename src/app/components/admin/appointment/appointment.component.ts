import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/shared/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { AppointmentService } from 'src/app/services/appointment.service';

@Component({
    selector: 'app-appointment',
    templateUrl: './appointment.component.html',
    styleUrls: ['./appointment.component.scss']
})
export class AppointmentComponent implements OnInit {
    breadcrumbItem: MenuItem[];
    home: MenuItem;

    constructor(
        private fb: FormBuilder,
        private notification: NotificationService,
        private appointmentAPI :AppointmentService
    ) {
        this.breadcrumbItem = [
            { label: 'Quản lý lịch hẹn' },
            { label: 'Danh sách lịch hẹn' },
        ];

        this.home = {
            icon: 'pi pi-home',
            routerLink: '/admin/admin-dashboard',
        };
     }

    ngOnInit(): void {
    }

}
