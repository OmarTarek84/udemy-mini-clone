import { Subscription } from 'rxjs';
import { AuthServicee } from './../services/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppService } from '../app.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {

  validatePassRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z\W\S]{1,}$/;
  accountForm = new FormGroup({
    fullname: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    currentpassword: new FormControl(''),
    password: new FormControl(''),
    confirmpassword: new FormControl(''),
  });
  imgSrc;
  file;

  userDetails;
  userDetSub: Subscription;

  successEditing = false;
  successEditingSub: Subscription;

  constructor(private authService: AuthServicee,
              public appService: AppService) { }

  ngOnInit(): void {
    this.successEditing = this.authService.successEditing;
    this.successEditingSub = this.authService.successEditingChanged.subscribe(ifsuccess => {
      this.successEditing = ifsuccess;
    })
    this.userDetails = this.authService.getUserDetails();
    this.accountForm.get('fullname').setValue(this.userDetails.username);
    this.accountForm.get('email').setValue(this.userDetails.email);
    this.imgSrc = this.userDetails.userPhoto;
    this.userDetSub = this.authService.userDetailsChanged.subscribe(userDet => {
      this.userDetails = userDet;
      this.accountForm.get('fullname').setValue(userDet.username);
      this.accountForm.get('email').setValue(userDet.email);
      this.imgSrc = userDet.userPhoto;
    })
  }

  profilephotoChanged(e) {
    this.file = e.target.files[0];
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();

      reader.readAsDataURL(e.target.files[0]);

      reader.onload = (event) => {
        this.imgSrc = event.target.result;
      }
    }
  }

  submitEditUserForm(e) {
    e.preventDefault();
    this.appService.loadingTrue('Editing User ...');
    this.successEditing = false;
    const formData = new FormData();
    formData.append('userdata', JSON.stringify(this.accountForm.value));
    if (this.file) {
      formData.append('image', this.file);
    }
    this.authService.editUser(formData).add(() => {
      this.accountForm.get('currentpassword').setValue('');
      this.accountForm.get('password').setValue('');
      this.accountForm.get('confirmpassword').setValue('');
      this.accountForm.markAsUntouched();
    })
  }

  ngOnDestroy() {
    this.userDetSub.unsubscribe();
    this.successEditingSub.unsubscribe();
  }

}
