import { AuthServicee } from './../../services/auth.service';
import { environment } from './../../../environments/environment';
import { SigninComponent } from './../signin/signin.component';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'angularx-social-login';

function ValidatePassword(control: AbstractControl) {
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z\W\S]{1,}$/;
  if (!passwordRegex.test(control.value)) {
    return { passwordError: true };
  } else {
    return null;
  }
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signupForm = new FormGroup({
    fullname: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      ValidatePassword,
    ]),
    confirmpassword: new FormControl('', [Validators.required]),
  });
  file;
  userImg;

  userLoading = false;
  googleLoginLoading = false;

  constructor(
    private dialogRef: MatDialogRef<SignupComponent>,
    private dialog: MatDialog,
    private http: HttpClient,
    private authGoogle: AuthService,
    private authService: AuthServicee
  ) {}

  ngOnInit(): void {}

  closeDialog() {
    this.dialogRef.close();
  }

  openSigninDialog(isUserCreated) {
    this.closeDialog();
    setTimeout(() => {
      if (isUserCreated) {
        this.dialog.open(SigninComponent, {
          data: 'Your Account Has been successfully Created!'
        });
      } else {
        this.dialog.open(SigninComponent);
      }
    }, 100);
  }

  userPhotoChange(e) {
    const file = e.target.files[0];
    this.file = file;
    const reader = new FileReader();
    reader.onload = (ev) => {
      this.userImg = ev.target.result;
    };
    reader.readAsDataURL(file);
  }

  signupNow(e) {
    e.preventDefault();
    let formData = new FormData();
    formData.append('image', this.file);
    formData.append('userdata', JSON.stringify(this.signupForm.value));
    this.userLoading = true;
    return this.http.post(environment.ip +  '/users/create-user', formData).subscribe(res => {
      this.userLoading = false;
      this.openSigninDialog(true);
    }, err => {
      return this.authService.logout();
    })
  }

  signWithGoogle(e) {
    e.preventDefault();
    this.googleLoginLoading = true;
    return this.authGoogle.authState.subscribe((user) => {
      return this.http.post(environment.ip + '/auth/googleLogin', user).subscribe((res: any) => {
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
        } else {
          this.openSigninDialog(true);
        }
        this.googleLoginLoading = false;
        this.dialogRef.close();
      });
    });
  }
}
