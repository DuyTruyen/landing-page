import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentRoutingModule } from './appointment-routing.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { AppointmentComponent } from './appointment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MTableModule } from 'src/app/shared/components/m-table/m-table.module';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { PipeModule } from 'src/app/shared/pipes/pipe.module';
import { ListboxModule } from 'primeng/listbox';


@NgModule({
  declarations: [AppointmentComponent],
  imports: [
    CommonModule,
    AppointmentRoutingModule,
    BreadcrumbModule,
    FormsModule,
    ReactiveFormsModule,
    MTableModule,
    DialogModule,
    InputTextModule,
    CalendarModule,
    DropdownModule,
    ScrollPanelModule,
    PipeModule,
    ListboxModule
  ]
})
export class AppointmentModule { }
