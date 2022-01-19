import { NgModule } from '@angular/core';
import { MaillogsComponent } from './maillogs.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: MaillogsComponent
  }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaillogsRoutingModule {}
