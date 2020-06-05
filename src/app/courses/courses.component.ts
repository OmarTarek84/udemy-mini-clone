import { AuthServicee } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {

  loggedIn = false;
  constructor(public router: Router, private authService: AuthServicee) { }

  ngOnInit(): void {
    this.loggedIn = this.authService.signedIn;
    this.authService.authChanged.subscribe(isloggedIn => {
      this.loggedIn = isloggedIn;
    })
  }

}
