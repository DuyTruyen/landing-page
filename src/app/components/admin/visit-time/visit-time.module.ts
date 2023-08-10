import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { VisitTimeComponent } from './visit-time.component';
import { VisitTimeRoutes } from './visit-time.routing';
import { RippleModule } from 'primeng/ripple';
import { DialogModule } from 'primeng/dialog';
import { MTableModule } from 'src/app/shared/components/m-table/m-table.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'src/app/shared/components/confirm-dialog/confirm-dialog.module';
import { InputTextModule } from 'primeng/inputtext';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { PipeModule } from 'src/app/shared/pipes/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    VisitTimeRoutes,
    RippleModule,
    DialogModule,
    MTableModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    ConfirmDialogModule,
    InputTextModule,
    BreadcrumbModule,
    CalendarModule,
    DropdownModule,
    InputSwitchModule,
    PipeModule
  ],
  declarations: [VisitTimeComponent],
  providers: [DatePipe]
})
export class VisitTimeModule { }
