import { AuthServicee } from './services/auth.service';
import { Injectable } from "@angular/core";
import { CanActivate, Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthServicee) {}

  canActivate() {
    if (!this.authService.getToken()) {
      this.router.navigate(['/home']);
    } else {
      return true;
    }
  }
}
