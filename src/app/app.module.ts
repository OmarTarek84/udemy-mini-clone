import { AuthGuard } from './auth.guard';
import { AppService } from './app.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import { AuthModule } from './auth/auth.module';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorResponseInterceptor } from './error-response.interceptor';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { CourseService } from './services/courses.service';
import { ToastrModule } from 'ngx-toastr';
import { cartService } from './services/cart.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    PageNotFoundComponent,
    ErrorDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatIconModule,
    MatSidenavModule,
    AuthModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    ToastrModule.forRoot()
  ],
  providers: [
    AppService,
    CourseService,
    cartService,
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: ErrorResponseInterceptor, multi: true },
    {
      provide: MatDialogRef,
      useValue: {}
    },
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorDialogComponent]
})
export class AppModule { }
