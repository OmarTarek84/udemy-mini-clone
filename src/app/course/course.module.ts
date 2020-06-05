import { CourseComponent } from './course.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { courseRoutess } from './course.routing';
import { MatIconModule } from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion';
import { HttpClientModule } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    CourseComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(courseRoutess),
    MatIconModule,
    MatExpansionModule,
    HttpClientModule,
    MatProgressSpinnerModule
  ],
})
export class CourseModule {}
