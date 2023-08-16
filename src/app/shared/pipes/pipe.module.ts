import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenderToTextPipe } from './gender-to-text.pipe';
import { SortPipe } from './sort.pipe';
import { LabelStatusPipe } from './label-status.pipe';
import { SpecimensTypeTextPipe } from './specimens-type-text.pipe';
import { LogTextPipe } from './log-text.pipe';
import { VisitSessionPipe } from './session-visit.pipe';
import { StatusToTextPipe } from './status-to-text.pipe';
import { PriorityToTextPipe } from './priority-to-text.pipe';



@NgModule({
    declarations: [GenderToTextPipe, SortPipe, LabelStatusPipe, SpecimensTypeTextPipe, LogTextPipe, VisitSessionPipe, StatusToTextPipe, PriorityToTextPipe],
    imports: [
        CommonModule,
    ],
    exports: [GenderToTextPipe, SortPipe, LabelStatusPipe, SpecimensTypeTextPipe, LogTextPipe, VisitSessionPipe, StatusToTextPipe, PriorityToTextPipe],
    providers: [LogTextPipe]
})
export class PipeModule { }
