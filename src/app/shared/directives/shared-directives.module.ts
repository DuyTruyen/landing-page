import { CommonModule } from "@angular/common";
import { ClickOutsideDirective } from "./click-outside.directive";
import { ClickStopPropagationDirective } from "./click-stop-propagation.directive";
import { NgModule } from "@angular/core";


@NgModule({
  declarations: [ClickStopPropagationDirective,
    ClickOutsideDirective,],
  imports: [
    CommonModule,
  ],
  exports: [ClickStopPropagationDirective,
    ClickOutsideDirective,]
})
export class SharedDirectivesModule { }
