import { Router } from '@angular/router';
import { CourseService } from './courses.service';
import { environment } from './../../environments/environment';
import { AuthServicee } from './auth.service';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({'providedIn': 'root'})
export class cartService {

  cart = [];
  cartChanged = new Subject<any[]>();
  cartLoadingChanged = new Subject<boolean>();
  reqFirstTIme = true;

  constructor(
    private authService: AuthServicee,
    private http: HttpClient,
    private courseService: CourseService,
    private router: Router
  ) {}

  addToCart(courseId) {
    this.cartLoadingChanged.next(true);
    return this.http.post(environment.ip + `/cart`, {courseId: courseId}, {
      headers: new HttpHeaders({'Authorization': 'Bearer ' + this.authService.getToken()})
    })
    .subscribe((course: any) => {
      this.cartLoadingChanged.next(false);
      this.cart.push(course.course);
      this.cartChanged.next(this.cart);
      this.authService.addUserCart(course.courseId);
    }, err => {
      this.cartLoadingChanged.next(false);
    })
  }

  getCart() {
    this.cartLoadingChanged.next(true);
    return this.http.get(environment.ip + `/cart`, {
      headers: new HttpHeaders({'Authorization': 'Bearer ' + this.authService.getToken()})
    }).subscribe((response: any) => {
      this.cart = response;
      this.cartChanged.next(this.cart);
      this.cartLoadingChanged.next(false);
      this.reqFirstTIme = false;
    }, err => {
      this.cartLoadingChanged.next(false);
    })
  }

  removeCart(courseId) {
    this.cartLoadingChanged.next(true);
    return this.http.post(environment.ip + `/cart/delete`, {courseId: courseId}, {
      headers: new HttpHeaders({'Authorization': 'Bearer ' + this.authService.getToken()})
    })
    .subscribe((course: any) => {
      this.cartLoadingChanged.next(false);
      const cartIndex = this.cart.findIndex(car => car._id === courseId);
      this.cart.splice(cartIndex, 1);
      this.cartChanged.next(this.cart);
      this.authService.removeCart(course.courseId);
    }, err => {
      this.cartLoadingChanged.next(false);
    })
  }

  movetowishlist(courseId) {
    this.cartLoadingChanged.next(true);
    return this.http.post(environment.ip + `/cart/moveToWishlist`, {courseId: courseId}, {
      headers: new HttpHeaders({'Authorization': 'Bearer ' + this.authService.getToken()})
    }).subscribe((res: any) => {
      const cartInd = this.cart.findIndex(c => c._id === courseId);
      this.cart.splice(cartInd, 1);
      this.cartChanged.next(this.cart);
      this.authService.removeCart(res.courseId);
      this.authService.addUserWishlist(res.courseId);
      this.courseService.moveToWishlistFromCart(res.courseToBeAddedToWishlist);
      this.cartLoadingChanged.next(false);
    }, err => {
      this.cartLoadingChanged.next(false);
    })
  }

  clearCart() {
    this.cartLoadingChanged.next(true);
    return this.http.post(environment.ip + `/cart/clear`, {}, {
      headers: new HttpHeaders({'Authorization': 'Bearer ' + this.authService.getToken()})
    }).subscribe((res: any) => {
      this.cart = [];
      this.cartChanged.next([]);
      this.authService.clearrCart();
      this.cartLoadingChanged.next(false);
    }, err => {
      this.cartLoadingChanged.next(false);
    })
  }

  processPayment(token, amount, courses) {
    this.cartLoadingChanged.next(true);
    let ids = [];
    let instructors = [];
    courses.forEach(course => {
      ids.push(course._id);
      instructors.push(course.user.username);
    });
    // const payment = {token, amount};
    return this.http.post(environment.ip + `/cart/order`, {courseIds: ids}, {
      headers: new HttpHeaders({'Authorization': 'Bearer ' + this.authService.getToken()})
    }).subscribe(res => {
      this.cart = [];
      this.cartChanged.next([]);
      this.cartLoadingChanged.next(false);
      this.courseService.getWishlist(1);
      this.authService.removeFromWishlistAfterOrder(ids);
      this.courseService.addEnrolledCourse(courses, instructors);
      this.router.navigate([`/lectures/${courses[0]._id}`]);
    }, err => {
      this.cartLoadingChanged.next(false);
    })
  }

  cartLogout() {
    this.cart = [];
    this.cartChanged.next(this.cart);
    this.cartLoadingChanged.next(false);
    this.reqFirstTIme = true;
  }

}
