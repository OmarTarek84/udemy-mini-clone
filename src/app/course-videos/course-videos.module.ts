import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseVideosComponent } from './course-videos.component';
import { courseVideosRoutes } from './course-videos.routing';
import { MatIconModule } from '@angular/material/icon';
import { MatVideoModule } from 'mat-video';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@NgModule({
  declarations: [CourseVideosComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(courseVideosRoutes),
    MatIconModule,
    MatVideoModule,
    MatProgressSpinnerModule
  ]
})
export class CourseVideosModule { }
