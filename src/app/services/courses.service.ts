import { AuthServicee } from './auth.service';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { AppService } from '../app.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { timeout } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CourseService {
  allCourses = [];
  filteredAllCourses = [];
  allCoursesChanged = new Subject<any[]>();
  homepageCourses = [];
  homepageCoursesChanged = new Subject<any[]>();
  allCoursesLoading = new Subject<boolean>();
  allCoursesRouteFirstTime = true;
  allCoursesPage = {
    currentPage: 1,
    pageSize: 6,
    totalItems: 100,
    numberOfPages: 100,
  }
  allCoursesPageChanged = new Subject<any>();

  ownCourses = [];
  filteredOwnCourses = [];
  ownCoursesChanged = new Subject<any[]>();
  ownCoursesLoading = new Subject<boolean>();
  ownCoursesRouteFirstTime = true;
  ownCoursesPage = {
    currentPage: 1,
    pageSize: 6,
    totalItems: 100,
    numberOfPages: 100,
  }
  ownCoursesPageChanged = new Subject<any>();

  wishlist = [];
  wishlistChanged = new Subject<any[]>();
  wishlistLoading = new Subject<boolean>();
  wishlistRouteFirstTime = true;
  wishlistPage = {
    currentPage: 1,
    pageSize: 6,
    totalItems: 100,
    numberOfPages: 100,
  }
  wishlistPageChanged = new Subject<any>();

  enrolledCourses = [];
  enrolledCoursesInstructors = [];
  enrolledCoursesInstructorsChanged = new Subject<any[]>();
  enrolledCoursesChanged = new Subject<any[]>();
  enrolledCoursesLoading = new Subject<boolean>();
  enrolledCoursesRouteFirstTime = true;
  enrolledCoursesPage = {
    currentPage: 1,
    pageSize: 6,
    totalItems: 100,
    numberOfPages: 100,
  }
  enrolledCoursesPageChanged = new Subject<any>();

  constructor(
    private appService: AppService,
    private http: HttpClient,
    private authService: AuthServicee,
    private router: Router
  ) {}

  allCoursesGet() {
    return [...this.allCourses];
  }

  ownCoursesGet() {
    return [...this.ownCourses];
  }

  wishlistGet() {
    return [...this.wishlist];
  }

  createCourse(courseDetailObj, coursesectionObj, aboutObj, courseFile: File) {
    this.appService.loadingTrue('Creating Course...');
    const requestToBeSent = {
      ...courseDetailObj,
      ...coursesectionObj,
      ...aboutObj,
    };
    const formData = new FormData();
    formData.append('image', courseFile);
    formData.append('coursedata', JSON.stringify(requestToBeSent));
    // formData.append('video', this.lessonVideos[0]);
    // this.lessonVideos.forEach((file) => { formData.append('video', file); });
    return this.http
      .post(environment.ip + '/courses', formData, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + this.authService.getToken(),
        }),
      })
      .pipe(
        timeout(200000)
      )
      .subscribe((res: any) => {
        this.appService.loadingFalse();
        this.authService.addOwnCourse(res._id);
        this.router.navigate(['/courses/my-courses']);
      });
  }

  getAllCourses(search, category, datesort, pageNumber) {
    this.allCoursesLoading.next(true);
    return this.http
      .get(
        environment.ip + `/courses/allCourses?search=${search}&category=${category}&sort=${datesort}&pageNumber=${pageNumber}`
      )
      .subscribe(
        (courses: any) => {
          this.filteredAllCourses = courses.resArray;
          if (
            search !== 'all' &&
            search !== '' &&
            search !== null &&
            search !== undefined
          ) {
            this.filteredAllCourses = courses.resArray;
          } else {
            this.allCourses = courses.resArray;
          }
          this.allCoursesChanged.next(this.filteredAllCourses);
          this.allCoursesLoading.next(false);
          this.allCoursesPage = {
            currentPage: pageNumber,
            numberOfPages: courses.pages,
            pageSize: courses.pageSize,
            totalItems: courses.totalNumberOfItems
          };
          this.allCoursesPageChanged.next(this.allCoursesPage);
          if (this.allCoursesRouteFirstTime) {
            this.homepageCourses = courses.resArray;
            this.homepageCoursesChanged.next([...this.homepageCourses]);
          }
          this.allCoursesRouteFirstTime = false;
        },
        (err) => {
          this.allCoursesLoading.next(false);
        }
      );
  }

  getOwnCourses(search, pageNumber) {
    this.ownCoursesLoading.next(true);
    return this.http
      .get(
        environment.ip + `/courses/ownCourses?search=${search}&pageNumber=${pageNumber}`,
        {
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + this.authService.getToken(),
          }),
        }
      )
      .subscribe(
        (courses: any) => {
          this.filteredOwnCourses = courses.resultArr;
          if (
            search !== 'all' &&
            search !== '' &&
            search !== null &&
            search !== undefined
          ) {
            this.filteredOwnCourses = courses.resultArr;
          } else {
            this.ownCourses = courses.resultArr;
          }
          this.ownCoursesChanged.next(this.filteredOwnCourses);
          this.ownCoursesLoading.next(false);
          this.ownCoursesRouteFirstTime = false;
          this.ownCoursesPage = {
            currentPage: pageNumber,
            numberOfPages: courses.pages,
            pageSize: courses.pageSize,
            totalItems: courses.totalNumberOfItems
          };
          this.ownCoursesPageChanged.next(this.ownCoursesPage);
        },
        (err) => {
          this.ownCoursesLoading.next(false);
        }
      );
  }

  deleteCourse(courseId) {
    this.allCoursesLoading.next(true);
    this.ownCoursesLoading.next(true);
    let t;
    if (this.router.url === '/courses/all-courses') {
      t = 'allcourses';
    } else {
      t = 'owncourses';
    }
    return this.http
      .post(
        environment.ip + `/courses/deleteCourse?t=${t}`,
        { courseId },
        {
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + this.authService.getToken(),
          }),
        }
      )
      .subscribe(
        (courses: any) => {
          if (this.router.url === '/courses/all-courses') {
            this.getOwnCourses(null, 1);
            this.allCourses = courses.resultArr;
            this.filteredAllCourses = courses.resultArr;
            this.allCoursesChanged.next(this.filteredAllCourses);
            this.allCoursesLoading.next(false);
            this.allCoursesPage = {
              currentPage: 1,
              numberOfPages: courses.pages,
              pageSize: courses.pageSize,
              totalItems: courses.totalNumberOfItems
            };
            this.allCoursesPageChanged.next(this.allCoursesPage);
          } else {
            this.getAllCourses('all', 'All', 'Newest', 1);
            this.ownCourses = courses.resultArr;
            this.filteredOwnCourses = courses.resultArr;
            this.ownCoursesChanged.next(this.filteredOwnCourses);
            this.ownCoursesLoading.next(false);
            this.ownCoursesPage = {
              currentPage: 1,
              numberOfPages: courses.pages,
              pageSize: courses.pageSize,
              totalItems: courses.totalNumberOfItems
            };
            this.ownCoursesPageChanged.next(this.ownCoursesPage);
          }
          this.ownCoursesLoading.next(false);
          this.allCoursesLoading.next(false);

        },
        (err) => {
          this.ownCoursesLoading.next(false);
          this.allCoursesLoading.next(false);
        }
      );
  }

  editCourse(
    courseDetailObj,
    coursesectionObj,
    aboutObj,
    courseFile: File,
    courseId,
    price
  ) {
    this.appService.loadingTrue('Updating Course...');
    const requestToBeSent = {
      ...courseDetailObj,
      ...coursesectionObj,
      ...aboutObj,
      coursePrice: Number(price),
    };
    const formData = new FormData();
    formData.append('coursedata', JSON.stringify(requestToBeSent));
    formData.append('image', courseFile);
    formData.append('courseId', courseId);
    return this.http
      .put(environment.ip + '/courses', formData, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + this.authService.getToken(),
        }),
      })
      .subscribe(
        (editedCourse) => {
          this.appService.loadingFalse();
          const allCoursesIndex = this.allCourses.findIndex(
            (p) => p._id === courseId
          );
          const ownCoursesIndex = this.ownCourses.findIndex(
            (p) => p._id === courseId
          );

          const filteredallCoursesIndex = this.filteredAllCourses.findIndex(
            (p) => p._id === courseId
          );
          const filteredownCoursesIndex = this.filteredOwnCourses.findIndex(
            (p) => p._id === courseId
          );
          this.allCourses[allCoursesIndex] = editedCourse;
          this.ownCourses[ownCoursesIndex] = editedCourse;
          this.filteredAllCourses[filteredallCoursesIndex] = editedCourse;
          this.filteredOwnCourses[filteredownCoursesIndex] = editedCourse;
          this.router.navigate([`/course/${courseId}`], {
            state: { data: editedCourse },
          });
        },
        (err) => {
          this.appService.loadingFalse();
        }
      );
  }

  addWishlist(courseId) {
    this.wishlistLoading.next(true);
    return this.http.post(environment.ip + '/courses/add-wishlist', {
      courseId: courseId
    }, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.authService.getToken(),
      })
    }).subscribe((coursee: any) => {
      const course = this.allCourses.find(cour => cour._id == courseId);
      const courseInd = this.wishlist.findIndex(wish => wish._id === coursee.courseId);
      if (courseInd > -1) {
        // this.wishlist.splice(courseInd, 1);
        this.getWishlist(1);
      } else {
        this.wishlist.unshift(course);
        this.wishlistChanged.next(this.wishlist);
        this.wishlistLoading.next(false);
        this.wishlistPage.totalItems += 1;
        this.wishlistPage.currentPage = 1;
        this.wishlistPage.numberOfPages = Math.ceil(this.wishlistPage.totalItems / this.wishlistPage.pageSize)
        this.wishlistPageChanged.next(this.wishlistPage);
      }
      this.authService.addUserWishlist(courseId);
    }, err => {
      this.wishlistLoading.next(false);
    })
  }

  moveToWishlistFromCart(course) {
    if (course) {
      this.wishlist.unshift(course);
      this.wishlistChanged.next(this.wishlist);
    }
  }

  getWishlist(pageNumber) {
    this.wishlistLoading.next(true);
    return this.http.get(environment.ip + `/courses/wishlist?pageNumber=${pageNumber}`, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.authService.getToken(),
      })
    }).subscribe((wishlists: any) => {
      this.wishlist = wishlists.resArray;
      this.wishlistChanged.next(this.wishlist);
      this.wishlistLoading.next(false);
      this.wishlistRouteFirstTime = false;
      this.wishlistPage = {
        currentPage: pageNumber,
        numberOfPages: wishlists.pages,
        pageSize: wishlists.pageSize,
        totalItems: wishlists.totalNumberOfItems
      };
      this.wishlistPageChanged.next(this.wishlistPage);
    }, err => {
      this.wishlistLoading.next(false);
    })
  }

  getEnrolledCourses(pageNumber, instructor) {
    this.enrolledCoursesLoading.next(true);
    return this.http
      .get(
        environment.ip +
          `/courses/enrolled-courses?instructor=${instructor}&pageNumber=${pageNumber}`,
        {
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + this.authService.getToken(),
          }),
        }
      ).subscribe((res: any) => {
        this.enrolledCoursesLoading.next(false);
        if (this.wishlistRouteFirstTime) {
          this.enrolledCoursesInstructors = res.instructors;
          this.enrolledCoursesInstructorsChanged.next(this.enrolledCoursesInstructors);
        }
        this.wishlistRouteFirstTime = false;
        this.enrolledCourses = res.resArray;
        this.enrolledCoursesChanged.next(this.enrolledCourses);
        this.enrolledCoursesRouteFirstTime = false;
        this.enrolledCoursesPage = {
          currentPage: pageNumber,
          numberOfPages: res.pages,
          pageSize: res.pageSize,
          totalItems: res.totalNumberOfItems
        };
        this.enrolledCoursesPageChanged.next(this.enrolledCoursesPage);
      }, err => {
        this.enrolledCoursesLoading.next(false);
      })
  }

  addEnrolledCourse(courses, instructors) {
    courses.forEach(course => {
      this.enrolledCourses.unshift(course);
    })
    this.enrolledCoursesInstructors.push([...instructors]);
    this.enrolledCoursesChanged.next(this.enrolledCourses);
    this.enrolledCoursesInstructorsChanged.next(this.enrolledCoursesInstructors);
    this.enrolledCoursesPage.totalItems += courses.length;
    this.enrolledCoursesPage.currentPage = 1;
    this.enrolledCoursesPage.numberOfPages = Math.ceil(this.enrolledCoursesPage.totalItems / this.enrolledCoursesPage.pageSize)
    this.enrolledCoursesPageChanged.next(this.enrolledCoursesPage);
    this.authService.addEnrolledCourse(courses);
  }

  afterLogout() {
    this.allCourses = [];
    this.filteredAllCourses = [];
    this.allCoursesChanged.next([]);
    this.allCoursesRouteFirstTime = true;
    this.ownCoursesRouteFirstTime = true;
    this.wishlistRouteFirstTime = true;
    this.enrolledCoursesRouteFirstTime = true;
    this.ownCourses = [];
    this.filteredOwnCourses = [];
    this.ownCoursesChanged.next([]);
    this.wishlist = [];
    this.wishlistChanged.next([]);
    this.allCoursesRouteFirstTime = true;
    this.ownCoursesRouteFirstTime = true;
    this.wishlistRouteFirstTime = true;
  }

}
