import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepartmentsRoutingModule } from './departments-routing.module';
import { RippleModule } from 'primeng/ripple';
import { DialogModule } from 'primeng/dialog';
import {PanelModule} from 'primeng/panel';
import { MTableModule } from 'src/app/shared/components/m-table/m-table.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'src/app/shared/components/confirm-dialog/confirm-dialog.module';
import { InputTextModule } from 'primeng/inputtext';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import {DividerModule } from 'primeng/divider';
import { DepartmentsComponent } from './departments.component';
import { InputSwitchModule } from 'primeng/inputswitch';


@NgModule({
  declarations: [
    DepartmentsComponent
  ],
  imports: [
    CommonModule,
    DepartmentsRoutingModule,
    RippleModule,
    DialogModule,
    MTableModule,
    PanelModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    ConfirmDialogModule,
    InputTextModule,
    BreadcrumbModule,
    CardModule,
    CheckboxModule,
    ScrollPanelModule,
    DividerModule,
    InputSwitchModule
  ]
})
export class DepartmentsModule { }
