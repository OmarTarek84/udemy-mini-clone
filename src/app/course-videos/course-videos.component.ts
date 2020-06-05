import { AuthServicee } from './../services/auth.service';
import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-course-videos',
  templateUrl: './course-videos.component.html',
  styleUrls: ['./course-videos.component.scss']
})
export class CourseVideosComponent implements OnInit {

  innerWidth;
  course;
  courseload = false;

  videoSrc;
  lessonTitle;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

  openCourseMenuResponsive = true;
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private authService: AuthServicee
  ) { }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    this.courseload = true;
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      return this.http.get(environment.ip + `/courses/course-begin?courseId=${paramMap.get('courseId')}`, {
        headers: new HttpHeaders({'Authorization': 'Bearer ' + this.authService.getToken()})
      }).subscribe((course: any) => {
        this.course = course;
        this.videoSrc = course.sections[0].sectionLessons[0].lessonVideoFile;
        this.lessonTitle = course.sections[0].sectionLessons[0].lessonName;
        this.courseload = false;
      }, err => {
        this.courseload = false;
        if (err.error && err.error.message && err.error.message === "Wrong URL!!!") {
          this.router.navigate(['/courses/all-courses']);
        } else if (err.error && err.error.message && err.error.message === "You are not authorized to view this course") {
          this.router.navigate([`/course/${paramMap.get('courseId')}`],{
            state: { data: this.course },
          });
        } else {
          this.router.navigate(['/']);
        }
      })
    })
  }

  onSelectVideo(sectionIndex, lessonIndex) {
    this.videoSrc = this.course.sections[sectionIndex].sectionLessons[lessonIndex].lessonVideoFile;
    this.lessonTitle = this.course.sections[sectionIndex].sectionLessons[lessonIndex].lessonName;
  }

}
