import { Router } from '@angular/router';
import { environment } from './../environments/environment';
import { AppService } from './app.service';
import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { AuthServicee } from './services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { SigninComponent } from './auth/signin/signin.component';
import { SignupComponent } from './auth/signup/signup.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('sidenav', { static: false }) sidenav;
  title = 'udemy-mini-clone';
  loadingText = 'Loading...';
  loader = false;
  wishlistNo = 0;
  cartNo = 0;
  constructor(
    private appService: AppService,
    public authService: AuthServicee,
    private dialog: MatDialog,
    private http: HttpClient,
    public router: Router
  ) {}

  ngOnInit() {
    this.loader = this.appService.loading;
    this.appService.loadingChanged.subscribe(load => {
      this.loader = load.loading;
      this.loadingText = load.text;
    })
    this.authService.userDetailsChanged.subscribe((details: any) => {
      this.wishlistNo = details.wishlist.length;
      this.cartNo = details.cart.length;
    });
    const expdate = localStorage.getItem('expDate');
    const token = localStorage.getItem('access_token');
    const remainingTimeForTokenToExpire =
    new Date(expdate).getTime() - new Date().getTime();
    if (expdate && token) {
      this.authService.token = token;
      if (new Date().getTime() >= new Date(expdate).getTime()) {
        return this.authService.logout();
      }
      return this.http
        .get(environment.ip + '/auth/profile', {
          headers: new HttpHeaders({ Authorization: 'Bearer ' + token }),
        })
        .subscribe((user: any) => {
          this.authService.signin(
            token,
            user.email,
            user.userPhoto,
            user.username,
            user.wishlist,
            user.cart,
            user.enrolledCourses,
            user.ownCourses
          );
        });
    }
  }

  ngAfterViewInit() {
    this.appService.setSidenav(this.sidenav);
  }

  opensigninDialog() {
    this.appService.closeSidenav();
    setTimeout(() => {
      this.dialog.open(SigninComponent);
    }, 200);
  }

  opensignupDialog() {
    this.appService.closeSidenav();
    setTimeout(() => {
      this.dialog.open(SignupComponent);
    }, 200);
  }

  closeSidenav() {
    this.appService.closeSidenav();
  }
}
