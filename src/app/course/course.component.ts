import { Subscription } from 'rxjs';
import { CourseService } from './../services/courses.service';
import { AuthServicee } from './../services/auth.service';
import { environment } from './../../environments/environment';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { cartService } from '../services/cart.service';
import { ToastrService } from 'ngx-toastr';

declare let StripeCheckout: any;

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit, OnDestroy {

  courseLoading = false;
  course;
  lecturesCount = 0;
  allExpanded = false;
  wishlistLoading = false;
  cartLoading = false;
  isLoggedIn = false;

  cartLoadingSub: Subscription;
  stripeHandler: any;

  @HostListener('window:popstate')
    onPopState() {
      this.stripeHandler.close();
    }

  constructor(private router: Router,
              private http: HttpClient,
              private authService: AuthServicee,
              private courseService: CourseService,
              private cartService: cartService,
              private toaster: ToastrService,
             ) { }

  ngOnInit() {
    this.isLoggedIn = this.authService.signedIn;
    this.courseService.wishlistLoading.subscribe(load => {
      this.wishlistLoading = load;
    });
    this.cartLoadingSub = this.cartService.cartLoadingChanged.subscribe(load => {
      this.cartLoading = load;
    })
    this.authService.authChanged.subscribe(isauth => {
      this.isLoggedIn = isauth;
    })
    if (history.state && history.state.data) {
      this.course = history.state.data;
      this.stripeHandler = StripeCheckout.configure({
        key: environment.stripeKey,
        locale: 'auto',
        token: token => {
          this.cartService.processPayment(token, this.course.coursePrice, [this.course])
        }
      })
      this.countLectures();
    } else {
      this.courseLoading = true;
      const courseId = this.router.url.split('/')[this.router.url.split('/').length - 1];
      return this.http.get(environment.ip + `/courses/course?courseid=${courseId}`).subscribe(course => {
        this.courseLoading = false;
        this.course = course;
        this.stripeHandler = StripeCheckout.configure({
          key: environment.stripeKey,
          locale: 'auto',
          token: token => {
            this.cartService.processPayment(token, this.course.coursePrice, [this.course])
          }
        })
        this.countLectures();
      }, err => {
        this.router.navigate(['/courses/all-courses']);
        this.courseLoading = false;
      })
    }
  }

  userDetails() {
    return this.authService.userDetails;
  }

  addToWishlist(courseId) {
    this.courseService.addWishlist(courseId);
  }

  countLectures() {
    this.course.sections.forEach(section => {
      this.lecturesCount += section.sectionLessons.length;
    });
  }

  cchangeToDate(utc) {
    return new Date(utc).toLocaleDateString();
  }

  addCart(courseId) {
    this.cartService.addToCart(courseId).add(() => {
      this.toaster.success('Course Added To Cart', 'Success', {
        positionClass: 'toast-bottom-center'
      });
    });
  }

  ngOnDestroy() {
    this.cartLoadingSub.unsubscribe();
  }

  onBuyCourse(courseId) {
    this.stripeHandler.open({
      name: 'udemy_clone Payment',
      description: 'Deposit Funds To Account',
      amount: this.course.coursePrice * 100
    });
  }

}
