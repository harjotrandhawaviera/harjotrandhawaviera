import { RouterModule, Routes } from '@angular/router';

import { ConfirmComponent } from './confirm/confirm.component';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { ContactComponent } from './contact/contact.component';
import { DataPrivacyComponent } from './data-privacy/data-privacy.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ImprintComponent } from './imprint/imprint.component';
import { LogInComponent } from './log-in/log-in.component';
import { NgModule } from '@angular/core';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LogInComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'dataprivacy',
    component: DataPrivacyComponent,
  },
  {
    path: 'imprint',
    component: ImprintComponent,
  },
  {
    path: 'contact',
    component: ContactComponent,
  },
  {
    path: 'confirm',
    component: ConfirmComponent,
  },
  {
    path: 'confirm/:type/:confirmToken',
    component: ConfirmEmailComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
