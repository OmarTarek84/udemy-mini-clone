import { CourseService } from './../../services/courses.service';
import { AuthServicee } from './../../services/auth.service';
import { Router } from '@angular/router';
import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-courses-list',
  templateUrl: './courses-list.component.html',
  styleUrls: ['./courses-list.component.scss'],
})
export class CoursesListComponent implements OnInit, OnChanges {
  @Input() allCourses;
  @Input() enrolledCourses;
  @Input() myCourses;
  @Input() wishlist;

  @Output() pageChangedOutput = new EventEmitter<any>();

  wishlistLoading = false;

  constructor(
    public router: Router,
    public authService: AuthServicee,
    private coursesService: CourseService,
    private toaster: ToastrService,
  ) {}

  paginateOptions = {
    spanPages: 2,
    previousPage: true,
    nextPage: true,
    firstPage: true,
    lastPage: true,
    titles: {
      firstPage: 'First',
      previousPage: 'Previous',
      lastPage: 'Last',
      nextPage: 'Next',
      pageSize: 'Items per page',
    },
  };

  page;

  ngOnInit(): void {
    this.coursesService.wishlistLoading.subscribe(load => {
      this.wishlistLoading = load;
    });
    if (this.router.url === '/courses/all-courses') {
      this.page = this.coursesService.allCoursesPage;
      this.coursesService.allCoursesPageChanged.subscribe(pages => {
        this.page = pages;
      })
    } else if (this.router.url === '/courses/my-courses') {
      this.page = this.coursesService.ownCoursesPage;
      this.coursesService.ownCoursesPageChanged.subscribe(pages => {
        this.page = pages;
      })
    } else if (this.router.url === '/courses/wishlist') {
      this.page = this.coursesService.wishlistPage;
      this.coursesService.wishlistPageChanged.subscribe(pages => {
        this.page = pages;
      })
    } else if (this.router.url === '/courses/enrolled-courses') {
      this.page = this.coursesService.enrolledCoursesPage;
      this.coursesService.enrolledCoursesPageChanged.subscribe(pages => {
        this.page = pages;
      })
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log(changes);
  }

  setPage(e) {
    this.pageChangedOutput.emit(e.currentPage);
  }

  onGoToCourse(course) {
    this.router.navigate([`/course/${course._id}`], {
      state: { data: course },
    });
  }

  deleteCourse(courseid) {
    this.coursesService.deleteCourse(courseid);
  }

  onEditCourse(courseid) {
    this.router.navigate([`/create-course/${courseid}`]);
  }

  onWishlist(courseId) {
    const beforeWishLength = this.authService.userDetails.wishlist.length;
    this.wishlistLoading = true;
    this.coursesService.addWishlist(courseId).add(() => {
      if (this.authService.userDetails.wishlist.length > beforeWishLength) {
        this.toaster.success('Course Added to Wishlist!', 'Success', {
          positionClass: 'toast-bottom-center'
        });
      } else {
        this.toaster.success('Course Removed From Wishlist!', 'Success', {
          positionClass: 'toast-bottom-center'
        });
      }
    });
  }

  onGoToCourseLecture(courseID) {
    this.router.navigate([`/lectures/${courseID}`]);
  }
}
