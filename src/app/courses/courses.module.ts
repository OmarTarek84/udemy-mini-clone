import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoursesComponent } from './courses.component';
import { coursesRoutes } from './courses.routing';
import { AllCoursesComponent } from './all-courses/all-courses.component';
import { EnrolledCoursesComponent } from './enrolled-courses/enrolled-courses.component';
import { MyCoursesComponent } from './my-courses/my-courses.component';
import { MyWishlistComponent } from './my-wishlist/my-wishlist.component';
import { MatIconModule } from '@angular/material/icon';
import { CoursesListComponent } from './courses-list/courses-list.component';
import { NgxPaginateModule } from 'ngx-paginate';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CoursesComponent,
    AllCoursesComponent,
    EnrolledCoursesComponent,
    MyCoursesComponent,
    MyWishlistComponent,
    CoursesListComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(coursesRoutes),
    MatIconModule,
    MatMenuModule,
    NgxPaginateModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    FormsModule
  ],
  providers: []
})
export class CoursesModule {}
