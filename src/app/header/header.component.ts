import { cartService } from './../services/cart.service';
import { CourseService } from './../services/courses.service';
import { AppService } from './../app.service';
import { Component, OnInit, HostListener } from '@angular/core';
import { AuthServicee } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SigninComponent } from '../auth/signin/signin.component';
import { SignupComponent } from '../auth/signup/signup.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

  innerWidth;
  allCategories = [
    { icon: 'developer_board', title: 'Development' },
    { icon: 'business_center', title: 'Business' },
    { icon: 'create', title: 'Design' },
    { icon: 'person_pin', title: 'PersonalDevelopment' },
    { icon: 'camera_enhance', title: 'Photography' },
    { icon: 'fitness_center', title: 'Health' },
    { icon: 'g_translate', title: 'Translation' },
  ];
  signedIn;
  authSub: Subscription;

  userPhoto;
  fullname;
  email;
  wishlistNo = 0;
  userDetSub: Subscription;
  wishlistNumberSub: Subscription;
  cartNoSub: Subscription;
  cartNo = 0;
  enrolledCoursesNo = 0;

  constructor(
    private appService: AppService,
    public authService: AuthServicee,
    private dialog: MatDialog,
    public router: Router,
    private courseService: CourseService,
    private cartService: cartService
  ) {}

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    this.signedIn = this.authService.signedIn;
    this.authSub = this.authService.getAuthChanged().subscribe((signedin) => {
      this.signedIn = signedin;
    });
    this.userDetSub = this.authService.userDetailsChanged.subscribe((details: any) => {
      this.userPhoto = details.userPhoto;
      this.fullname = details.username;
      this.email = details.email;
      this.wishlistNo = details.wishlist.length;
      this.cartNo = details.cart.length;
      this.enrolledCoursesNo = details.enrolledCourses.length
    });
  }

  toggleSidenav() {
    this.appService.toggle();
  }

  onLogout() {
    this.courseService.allCourses = [];
    this.courseService.afterLogout();
    this.cartService.cartLogout();
    this.authService.logout();
  }

  openSignInDialog() {
    this.dialog.open(SigninComponent);
    // this.dialog.open(ResetPasswordComponent);
  }

  openSignUpDialog() {
    this.dialog.open(SignupComponent);
  }

  onGoToAccount() {
    this.router.navigate(['/account']);
  }

  onGoToWishlist() {
    this.router.navigate(['/courses/wishlist']);
  }

  onGoToHome() {
    this.router.navigate(['/']);
  }

  onGoToCart() {
    this.router.navigate(['/cart']);
  }

  onGoToCourses(cat) {
    this.router.navigate(['/courses/all-courses'], { state: { catFromHeader: cat }});
  }
}
