import { createCourseRoutes } from './create-course.routing';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateCourseComponent } from './create-course.component';
import {MatTabsModule} from '@angular/material/tabs';
import { AboutYouComponent } from './about-you/about-you.component';
import { CourseDetailsComponent } from './course-details/course-details.component';
import { CourseSectionsComponent } from './course-sections/course-sections.component';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import {MatTooltipModule} from '@angular/material/tooltip';
import { CourseService } from '../services/courses.service';
import {MatSelectModule} from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@NgModule({
  declarations: [CreateCourseComponent, AboutYouComponent, CourseDetailsComponent, CourseSectionsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(createCourseRoutes),
    MatTabsModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatTooltipModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  providers: []
})
export class CreateCourseModule { }
