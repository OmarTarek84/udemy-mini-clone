import { Router } from '@angular/router';
import { AuthServicee } from './../../services/auth.service';
import { Subscription } from 'rxjs';
import { CourseService } from './../../services/courses.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-my-courses',
  templateUrl: './my-courses.component.html',
  styleUrls: ['./my-courses.component.scss']
})
export class MyCoursesComponent implements OnInit, OnDestroy {

  searchCo = '';

  myCourses = [
  ];
  coursesSub: Subscription;
  courseLoadingSub: Subscription;
  coursesLoading = false;

  constructor(private coursesService: CourseService, private router: Router, private authS: AuthServicee) { }

  ngOnInit(): void {
    this.myCourses = this.coursesService.ownCoursesGet();
    this.coursesSub = this.coursesService.ownCoursesChanged.subscribe(cs => {
      this.myCourses = cs;
    });
    this.courseLoadingSub = this.coursesService.ownCoursesLoading.subscribe(load => {
      this.coursesLoading = load;
    })

    this.coursesService.getOwnCourses('all', 1);
  }

  searchMyCourses() {
    if (this.coursesLoading) {
      return null;
    }
    this.coursesService.getOwnCourses(this.searchCo, 1);
  }

  pageChange(e) {
    this.coursesService.getOwnCourses(this.searchCo, e);
  }

  ngOnDestroy() {
    if (this.coursesSub) {
      this.coursesSub.unsubscribe();
    }
    if (this.courseLoadingSub) {
      this.courseLoadingSub.unsubscribe();
    }
  }

}
