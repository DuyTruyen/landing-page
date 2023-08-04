import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentRoutingModule } from './appointment-routing.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { AppointmentComponent } from './appointment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [AppointmentComponent],
  imports: [
    CommonModule,
    AppointmentRoutingModule,
    BreadcrumbModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AppointmentModule { }
