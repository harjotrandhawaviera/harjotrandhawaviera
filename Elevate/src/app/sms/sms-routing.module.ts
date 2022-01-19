import { RouterModule, Routes } from '@angular/router';

import { CreateSmsComponent } from './create-sms/create-sms.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: CreateSmsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmsRoutingModule { }
