import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from '../app.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthServicee {
  signedIn = false;
  authChanged = new Subject<boolean>();

  userDetails = {
    email: '',
    userPhoto: '',
    username: '',
    wishlist: [],
    cart: [],
    enrolledCourses: [],
    ownCourses: []
  };
  userDetailsChanged = new Subject<any>();
  timer;
  token;

  successEditing = false;
  successEditingChanged = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    private appService: AppService,
    private router: Router
  ) {}

  getSignedIn() {
    return this.signedIn;
  }

  getToken() {
    return this.token;
  }

  getAuthChanged() {
    return this.authChanged.asObservable();
  }

  getUserDetails() {
    return this.userDetails;
  }

  logout() {
    this.signedIn = false;
    this.authChanged.next(false);
    this.token = null;
    this.userDetails = {
      email: '',
      userPhoto: '',
      username: '',
      cart: [],
      wishlist: [],
      enrolledCourses: [],
      ownCourses: []
    };
    this.userDetailsChanged.next({
      email: '',
      userPhoto: '',
      username: '',
      cart: [],
      wishlist: [],
      enrolledCourses: [],
      ownCourses: []
    });
    localStorage.removeItem('access_token');
    localStorage.removeItem('expDate');
    clearTimeout(this.timer);
    this.router.navigate(['/home']);
  }

  signin(
    token: string,
    email: string,
    userPhoto: string,
    username: string,
    wishlist: any[],
    cart: any[],
    enrolledCourses: any[],
    ownCourses: any[]
  ) {
    this.token = token;
    const expDate = new Date(new Date().getTime() + 2 * 60 * 60 * 1000);

    localStorage.setItem('access_token', token);
    if (!localStorage.getItem('expDate')) {
      localStorage.setItem('expDate', expDate.toString());
    }

    this.signedIn = true;
    this.authChanged.next(true);

    this.userDetails = {
      email: email,
      userPhoto: userPhoto,
      username: username,
      wishlist: wishlist,
      cart: cart,
      enrolledCourses: enrolledCourses,
      ownCourses: ownCourses
    };

    this.userDetailsChanged.next({
      email: email,
      userPhoto: userPhoto,
      username: username,
      wishlist: wishlist,
      cart: cart,
      enrolledCourses: enrolledCourses,
      ownCourses: ownCourses
    });

    const remainingTimeForTokenToExpire =
      new Date(localStorage.getItem('expDate')).getTime() -
      new Date().getTime();

    this.autoLogout(remainingTimeForTokenToExpire);
  }

  autoLogout(time) {
    this.timer = setTimeout(() => {
      this.logout();
    }, time);
  }

  addUserWishlist(wishlist) {
    const wishIndex = this.userDetails.wishlist.findIndex((p) => {
      return p === wishlist;
    });
    if (wishIndex > -1) {
      this.userDetails.wishlist.splice(wishIndex, 1);
    } else {
      this.userDetails.wishlist.push(wishlist);
    }
    this.userDetailsChanged.next({
      ...this.userDetails,
    });
  }

  addUserCart(courseId) {
    this.userDetails.cart.push(courseId);
    this.userDetailsChanged.next({
      ...this.userDetails,
    });
  }

  removeCart(courseId) {
    this.userDetails.cart = this.userDetails.cart.filter((c) => c !== courseId);
    this.userDetailsChanged.next({
      ...this.userDetails,
    });
  }

  editUser(formData) {
    this.successEditing = false;
    this.successEditingChanged.next(false);
    return this.http
      .put(
        environment.ip +
        '/users/edit-user',
        formData,
        {
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + this.token,
          }),
        }
      )
      .subscribe((response: any) => {
        this.userDetails = {
          email: response.email,
          userPhoto: response.userPhoto,
          username: response.username,
          wishlist: response.wishlist,
          cart: response.cart,
          enrolledCourses: response.enrolledCourses,
          ownCourses: response.ownCourses
        };
        this.userDetailsChanged.next({
          email: response.email,
          userPhoto: response.userPhoto,
          username: response.username,
          wishlist: response.wishlist,
          cart: response.cart,
          enrolledCourses: response.enrolledCourses,
          ownCourses: response.ownCourses
        });
        this.appService.loadingFalse();
        this.successEditing = true;
        this.successEditingChanged.next(true);
      });
  }

  addOwnCourse(courseId) {
    this.userDetails.ownCourses.push(courseId);
    this.userDetailsChanged.next({
      ...this.userDetails,
    });
  }

  addEnrolledCourse(courses) {
    courses.forEach(course => {
      this.userDetails.enrolledCourses.push(course._id);
    })
    this.userDetailsChanged.next({
      ...this.userDetails,
    });
  }

  clearrCart() {
    this.userDetails.cart = [];
    this.userDetailsChanged.next({
      ...this.userDetails,
    });
  }

  removeFromWishlistAfterOrder(courseIds) {
    for (let i = this.userDetails.wishlist.length - 1; i >= 0; i--) {
      for (let j = 0; j < courseIds.length; j++) {
        if (this.userDetails.wishlist[i] === courseIds[j]) {
          this.userDetails.wishlist.splice(i, 1);
        }
      }
    }
    this.userDetails.cart = [];
    this.userDetailsChanged.next({
      ...this.userDetails,
    });
  }
}
