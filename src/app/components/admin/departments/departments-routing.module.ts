import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { DepartmentsComponent } from "./departments.component";

@NgModule({
    imports: [RouterModule.forChild([
        {path: '', component: DepartmentsComponent},
    ])],
    exports: [RouterModule]
})
export class DepartmentsRoutingModule {}
