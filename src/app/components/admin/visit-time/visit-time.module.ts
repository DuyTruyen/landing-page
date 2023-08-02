import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    BreadcrumbModule
  ],
  declarations: [VisitTimeComponent]
})
export class VisitTimeModule { }
