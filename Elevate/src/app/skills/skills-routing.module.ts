import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkillDetailComponent } from './skill-detail/skill-detail.component';
import { SkillEditComponent } from './skill-edit/skill-edit.component';
import { SkillListComponent } from './skill-list/skill-list.component';

const routes: Routes = [
  {
    path: '',
    component: SkillListComponent,
  },
  {
    path: 'create',
    component: SkillEditComponent,
    data: { mode: 'create' },
  },
  {
    path: ':id',
    component: SkillEditComponent,
    data: { mode: 'edit' },
  },
  {
    path: ':id/detail',
    component: SkillDetailComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SkillsRoutingModule {}
