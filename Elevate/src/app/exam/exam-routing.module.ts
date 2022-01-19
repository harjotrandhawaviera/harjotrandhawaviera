import { RouterModule, Routes } from '@angular/router';

import { ExamModalComponent } from './exam-modal/exam-modal.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: ':id',
    component: ExamModalComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamRoutingModule { }
