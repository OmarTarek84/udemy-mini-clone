import { AuthService } from 'angularx-social-login';
import { AuthServicee } from './../../services/auth.service';
import { environment } from './../../../environments/environment';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SignupComponent } from '../signup/signup.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  signinForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  })

  resetPasswordMode = false;
  resetEmailSent = false;
  emailToResetPassword = '';

  loading = false;
  wrongUsernameOrPassword = '';

  googleLoginLoading = false;

  restPasswordError = '';

  constructor(private dialogRef: MatDialogRef<SigninComponent>,
              private dialog: MatDialog,
              private authService: AuthServicee,
              @Inject(MAT_DIALOG_DATA) public data,
              private http: HttpClient,
              private authGoogle: AuthService,) { }

  ngOnInit(): void {
  }

  closeDialog() {
    this.dialogRef.close();
    this.resetPasswordMode = false;
  }

  openSignupDialog() {
    this.closeDialog();
    setTimeout(() => {
      this.dialog.open(SignupComponent);
    }, 100);
  }

  onSubmitResetEmail(e) {
    e.preventDefault();
    this.loading = true;
    this.restPasswordError = '';
    return this.http.post(environment.ip + '/users/reset-password', {email: this.emailToResetPassword}, {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    }).subscribe(success => {
      this.loading = false;
      this.resetEmailSent = true;
      return success;
    }, err => {
      if (err.error&&err.error.message&&Array.isArray(err.error.message)) {
        this.restPasswordError = err.error.message[0];
      } else {
        this.restPasswordError = 'Something went wrong, Please Try Again';
      }
      this.loading = false;
    })
  }

  Signin(e) {
    e.preventDefault();
    this.loading = true;
    return this.http.post(environment.ip + '/auth/login', {
      email: this.signinForm.get('email').value,
      password: this.signinForm.get('password').value
    }).subscribe((result: any) => {
      this.loading = false;
      this.wrongUsernameOrPassword = '';
      this.authService.signin(
        result.accessToken,
        result.email,
        result.userPhoto,
        result.fullname,
        result.wishlist,
        result.cart,
        result.enrolledCourses,
        result.ownCourses
      );
      this.dialogRef.close();
    }, err => {
      this.loading = false;
      this.wrongUsernameOrPassword = err.error&&err.error.message&&Array.isArray(err.error.message) ? err.error.message[0]: 'Something Went Wrong, Please try Again'
    })
  }

  signWithGoogle(e) {
    e.preventDefault();
    this.googleLoginLoading = true;
    return this.authGoogle.authState.subscribe((user) => {
      return this.http.post(environment.ip +  '/auth/googleLogin', user).subscribe((res: any) => {
        if (res.accessToken) {
          this.authService.signin(
            res.accessToken,
            res.email,
            res.userPhoto,
            res.fullname,
            res.wishlist,
            res.cart,
            res.enrolledCourses,
            res.ownCourses
          );
        }
        this.googleLoginLoading = false;
        this.dialogRef.close();
      });
    });
  }

}
