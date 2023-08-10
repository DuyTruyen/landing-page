import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsComponent } from './news.component';
import { NewsRoutingModule } from './news-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MTableModule } from 'src/app/shared/components/m-table/m-table.module';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ConfirmDialogModule } from 'src/app/shared/components/confirm-dialog/confirm-dialog.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { InputSwitchModule } from 'primeng/inputswitch';
import { EditorModule } from 'primeng/editor';

@NgModule({
    declarations: [NewsComponent],
    imports: [
        MTableModule,
        InputTextModule,
        RippleModule,
        ButtonModule,
        FormsModule,
        CommonModule,
        NewsRoutingModule,
        ButtonModule,
        BreadcrumbModule,
        DialogModule,
        AutoCompleteModule,
        ConfirmDialogModule,
        BreadcrumbModule,
        ReactiveFormsModule,
        InputSwitchModule,
        EditorModule
    ],
})
export class NewsModule {}
