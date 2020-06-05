import { Routes } from '@angular/router';
import { CreateCourseComponent } from './create-course.component';

export const createCourseRoutes: Routes = [
  {path: '', component: CreateCourseComponent},
  {path: ':courseId', component: CreateCourseComponent}
];
