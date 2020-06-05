import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { AuthServicee } from '../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { HttpClientModule } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SocialLoginModule, AuthServiceConfig } from 'angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider,
} from 'angularx-social-login';

let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider(
      '152011675349-vi6vkjhi1pg5rl16uv7a14q6meklvetf.apps.googleusercontent.com'
    ),
  },
]);

export function provideConfig() {
  return config;
}

@NgModule({
  declarations: [SigninComponent, SignupComponent, ResetPasswordComponent],
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    SocialLoginModule,
  ],
  entryComponents: [SigninComponent, SignupComponent, ResetPasswordComponent],
  providers: [
    AuthServicee,
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig,
    },
  ],
})
export class AuthModule {}
