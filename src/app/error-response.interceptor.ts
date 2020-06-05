import { environment } from './../environments/environment';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { AppService } from './app.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorResponseInterceptor {
  constructor(private dialog: MatDialog, private appService: AppService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // });
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
          if (req.url !== environment.ip + '/auth/login' &&
              req.url !== environment.ip + '/users/reset-password' &&
              req.url !== environment.ip + '/users/new-password' &&
              req.url.indexOf('/courses/course?courseid') < 0) {
            this.dialog.closeAll();
            this.appService.loadingFalse();
            setTimeout(() => {
              if (err.error&&err.error.message&&Array.isArray(err.error.message)) {
                this.dialog.open(ErrorDialogComponent, {
                  data: err.error.message
                })
              } else if (err.error&&err.error.message === 'Unauthorized') {
                this.dialog.open(ErrorDialogComponent, {
                  data: ['You Are Unauthorized']
                })
              } else if (err.error&&err.error.message) {
                this.dialog.open(ErrorDialogComponent, {
                  data: [err.error.message]
                })
              } else {
                this.dialog.open(ErrorDialogComponent, {
                  data: ['Something Went Wrong, Please Try Again']
                })
              }
            }, 100);
          }
        return throwError(err);
      })
    );
  }
}
