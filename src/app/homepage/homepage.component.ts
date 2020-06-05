import { CourseService } from './../services/courses.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, HostListener, AfterViewInit, OnDestroy } from '@angular/core';
import {
  SwiperConfigInterface,
  SwiperPaginationInterface,
} from 'ngx-swiper-wrapper';
import { AuthServicee } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ResetPasswordComponent } from '../auth/reset-password/reset-password.component';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit, AfterViewInit, OnDestroy {
  innerWidth;
  searchCourse;

  loggedIn = false;
  authSub: Subscription;

  fullName;
  userDetailsSub: Subscription;

  recommendedCourses = [];
  coursesLoading = false;

  recommendedCoursesSub: Subscription;
  recommendedCoursesLoadingSub: Subscription;
  public config: SwiperConfigInterface = {
    a11y: true,
    direction: 'horizontal',
    slidesPerView: 3,
    keyboard: true,
    mousewheel: false,
    scrollbar: false,
    navigation: true,
    pagination: false,
    spaceBetween: 15,
  };

  private pagination: SwiperPaginationInterface = {
    el: '.swiper-pagination',
    clickable: true,
    hideOnClick: false,
  };

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth < 768) {
      this.config = {
        ...this.config,
        slidesPerView: 1,
      };
    } else {
      this.config = {
        ...this.config,
        slidesPerView: 3,
      };
    }
  }

  faqs = [
    {
      question:
        'Can I get a refund for Teach Online Plus if it’s not right for me?',
      answer:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
    },
    {
      question: 'How Do I Access My Courses?',
      answer:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
    },
    {
      question: 'What Can I Do if I Forgot My Password?',
      answer:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
    },
    {
      question: 'How Long Will I have Access to the course?',
      answer:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
    },
    {
      question: 'Is there A Certificate After I finish?',
      answer:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
    },
  ];

  search;

  constructor(
    private authService: AuthServicee,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    this.recommendedCourses = this.courseService.homepageCourses;
    this.recommendedCoursesLoadingSub = this.courseService.allCoursesLoading.subscribe(load => {
      this.coursesLoading = load;
    });
    this.recommendedCoursesSub = this.courseService.homepageCoursesChanged.subscribe(courses => {
      this.recommendedCourses = courses;
    })
    this.authSub = this.authService.authChanged.subscribe((logged) => {
      this.loggedIn = logged;
    });
    this.userDetailsSub = this.authService.userDetailsChanged.subscribe(
      (details) => {
        this.fullName = details.username;
      }
    );
    if (this.courseService.allCoursesRouteFirstTime) {
      this.courseService.getAllCourses('', 'All', 'Newest', 1);
    }
    this.route.queryParams.subscribe((params) => {
      if (params.token) {
        this.dialog.open(ResetPasswordComponent, {
          data: {
            token: params.token,
          },
          disableClose: true,
        });
      }
    });

  }

  ngAfterViewInit() {
    if (this.innerWidth < 768) {
      this.config = {
        ...this.config,
        slidesPerView: 1,
      };
    } else {
      this.config = {
        ...this.config,
        slidesPerView: 3,
      };
    }
  }

  goToCourse(course) {
    this.router.navigate([`/course/${course._id}`], {
      state: { data: course },
    });
  }

  onGoToCreate() {
    this.router.navigate(['/create-course']);
  }

  searchCourseGoToCourses() {
    this.router.navigate(['/courses/all-courses'], { state: { searchFromHomepage: this.search }});
  }

  ngOnDestroy() {
    this.recommendedCoursesSub.unsubscribe();
  }

}
