import { RouterModule, Routes } from '@angular/router';

import { CreateEmailComponent } from './create-email/create-email.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: CreateEmailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailsRoutingModule { }
