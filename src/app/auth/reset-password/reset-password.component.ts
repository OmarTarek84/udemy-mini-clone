import { AuthServicee } from './../../services/auth.service';
import { environment } from './../../../environments/environment';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

function ValidatePassword(control: AbstractControl) {
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z\W\S]{1,}$/;
  if (!passwordRegex.test(control.value)) {
    return { 'passwordError': true };
  } else {
    return null;
  }
}

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  resetForm = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(8), ValidatePassword]),
    confirm: new FormControl('', [Validators.required]),
  })
  resetPasswordSent = false;
  resetPasswordError = '';
  loading = false;
  constructor(private dialogRef: MatDialogRef<ResetPasswordComponent>,
              private http: HttpClient,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private authService: AuthServicee,
              private router: Router) { }

  ngOnInit(): void {
  }

  closeDialog() {
    this.dialogRef.close();
  }

  onConf() {
    this.closeDialog();
  }

  onSubmitResetPassword(e) {
    e.preventDefault();
    this.resetPasswordError = '';
    this.loading = true;
    return this.http.post(environment.ip + '/users/new-password', {
      password: this.resetForm.get('password').value,
      confirm: this.resetForm.get('confirm').value,
      token: this.data.token
    }).subscribe((res: any) => {
      this.loading = false;
      this.resetPasswordSent = true;
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
      this.resetPasswordError = '';
      this.router.navigate([], {
        queryParams: {
          token: null,
        },
        queryParamsHandling: 'merge'
      })
    }, err => {
      this.loading = false;
      this.resetPasswordError = err.error&&err.error.message&&Array.isArray(err.error.message) ? err.error.message[0]: 'Something Went Wrong, Please try Again'
    })
  }

}
