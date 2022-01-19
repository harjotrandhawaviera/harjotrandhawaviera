import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'skills',
    loadChildren: () =>
      import('./../skills/skills.module').then((m) => m.SkillsModule),
  },
  {
    path: 'roles',
    loadChildren: () =>
      import('./../roles/roles.module').then((m) => m.RolesModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterRoutingModule {}
