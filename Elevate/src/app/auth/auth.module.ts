import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthFooterComponent } from './auth-footer/auth-footer.component';
import { AuthRoutingModule } from './auth-routing.module';
import { CommonModule } from '@angular/common';
import { ConfirmComponent } from './confirm/confirm.component';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { ContactComponent } from './contact/contact.component';
import { CoreModule } from './../core/core.module';
import { DataPrivacyComponent } from './data-privacy/data-privacy.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ImprintComponent } from './imprint/imprint.component';
import { IonicModule } from '@ionic/angular';
import { LogInComponent } from './log-in/log-in.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { NgModule } from '@angular/core';
import { PermissionDeniedComponent } from './permission-denied/permission-denied.component';
import { PreambleComponent } from './preamble/preamble.component';
import { RegisterComponent } from './register/register.component';
import { RouterModule } from '@angular/router';
import { StoreBadgesComponent } from './store-badges/store-badges.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    IonicModule,
    AuthRoutingModule,
    MatSelectModule
  ],

  declarations: [
    DataPrivacyComponent,
    ImprintComponent,
    ContactComponent,
    PermissionDeniedComponent,
    LogInComponent,
    ForgotPasswordComponent,
    ConfirmEmailComponent,
    ConfirmComponent,
    PreambleComponent,
    RegisterComponent,
    AuthFooterComponent,
    StoreBadgesComponent,
  ],
  exports: [DataPrivacyComponent,
    ImprintComponent,
    ContactComponent,
    PermissionDeniedComponent,
    LogInComponent,
    ForgotPasswordComponent,
    ConfirmEmailComponent,
    ConfirmComponent,
    PreambleComponent,
    RegisterComponent,
    AuthFooterComponent,
    StoreBadgesComponent]
})
export class AuthModule { }
