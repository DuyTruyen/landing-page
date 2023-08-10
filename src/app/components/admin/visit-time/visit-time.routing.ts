import { Routes, RouterModule } from '@angular/router';
import { VisitTimeComponent } from './visit-time.component';

const routes: Routes = [
    {path: '', component: VisitTimeComponent }
];

export const VisitTimeRoutes = RouterModule.forChild(routes);
