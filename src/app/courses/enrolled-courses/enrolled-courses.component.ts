import { AuthServicee } from './../../services/auth.service';
import { Router } from '@angular/router';
import { MatSelectChange } from '@angular/material/select';
import { Subscription } from 'rxjs';
import { CourseService } from './../../services/courses.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-enrolled-courses',
  templateUrl: './enrolled-courses.component.html',
  styleUrls: ['./enrolled-courses.component.scss']
})
export class EnrolledCoursesComponent implements OnInit, OnDestroy {

  enrolledCourses = [
  ];
  coursesLoading = false;
  enrolledCoursesLoadingSub: Subscription;
  enrolledCoursesSub: Subscription;
  enrolledInstructorsSub: Subscription;
  coursesInstructors = [];
  selectedInstructor = 'All';

  constructor(private courseService: CourseService, private router: Router, private authS: AuthServicee) { }

  ngOnInit(): void {
    this.enrolledCourses = this.courseService.enrolledCourses;
    this.coursesInstructors = this.courseService.enrolledCoursesInstructors;
    this.enrolledCoursesSub = this.courseService.enrolledCoursesChanged.subscribe(courses => {
      this.enrolledCourses = courses;
    });
    this.enrolledInstructorsSub = this.courseService.enrolledCoursesInstructorsChanged.subscribe(ins => {
      this.coursesInstructors = ['All', ...ins];
    })
    this.enrolledCoursesLoadingSub = this.courseService.enrolledCoursesLoading.subscribe(load => {
      this.coursesLoading = load;
    });
    this.courseService.getEnrolledCourses(1, 'All');
    if (this.coursesInstructors.indexOf('All') < 0) {
      this.coursesInstructors.push('All');
    }
  }

  clearAll() {

  }

  pageChange(e) {
    this.courseService.getEnrolledCourses(e, this.selectedInstructor);
  }

  instructorChange(e: MatSelectChange) {
    this.selectedInstructor = e.value;
    this.courseService.getEnrolledCourses(1, this.selectedInstructor);
  }

  ngOnDestroy() {
    if (this.enrolledCoursesSub) {
      this.enrolledCoursesSub.unsubscribe();
    }
    if (this.enrolledCoursesLoadingSub) {
      this.enrolledCoursesLoadingSub.unsubscribe();
    }
    if (this.enrolledInstructorsSub) {
      this.enrolledInstructorsSub.unsubscribe();
    }
  }

}
