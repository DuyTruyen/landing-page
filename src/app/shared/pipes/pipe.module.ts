import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenderToTextPipe } from './gender-to-text.pipe';
import { SortPipe } from './sort.pipe';
import { LabelStatusPipe } from './label-status.pipe';
import { SpecimensTypeTextPipe } from './specimens-type-text.pipe';
import { LogTextPipe } from './log-text.pipe';



@NgModule({
    declarations: [GenderToTextPipe, SortPipe, LabelStatusPipe, SpecimensTypeTextPipe, LogTextPipe],
    imports: [
        CommonModule,
    ],
    exports: [GenderToTextPipe, SortPipe, LabelStatusPipe, SpecimensTypeTextPipe, LogTextPipe],
    providers: [LogTextPipe]
})
export class PipeModule { }
