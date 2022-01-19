import { RouterModule, Routes } from '@angular/router';

import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { DataPrivacyComponent } from './data-privacy/data-privacy.component';
import { LogInComponent } from './log-in/log-in.component';
import { NgModule } from '@angular/core';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {
    path: 'login',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        component: LogInComponent,
      },
    ],
  },
  {
    path: 'register',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        component: RegisterComponent,
      },
    ],
  },
  {
    path: 'dataprivacy',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        component: DataPrivacyComponent,
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
