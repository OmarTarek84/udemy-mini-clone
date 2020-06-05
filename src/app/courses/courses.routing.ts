import { AuthGuard } from './../auth.guard';
import { Routes } from '@angular/router';
import { CoursesComponent } from './courses.component';

export const coursesRoutes: Routes = [
    {path: '', redirectTo: 'all-courses', pathMatch: 'full', component: CoursesComponent},
    {path: 'all-courses', component: CoursesComponent},
    {path: 'enrolled-courses', component: CoursesComponent, canActivate: [AuthGuard]},
    {path: 'my-courses', component: CoursesComponent, canActivate: [AuthGuard]},
    {path: 'wishlist', component: CoursesComponent, canActivate: [AuthGuard]},
]
