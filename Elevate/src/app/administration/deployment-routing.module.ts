import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeploymentLocationComponent } from './deployment-location/deployment-location.component';
import { DeploymentLocationDetailsComponent } from './deployment-location-details/deployment-location-details.component';
import { DeploymentEditDetailsComponent } from './deployment-edit-details/deployment-edit-details.component';

const routes: Routes = [
  {
    path: '',
    component: DeploymentLocationComponent
  },
  {
    path: 'create',
    component: DeploymentEditDetailsComponent,
    data: { mode: 'create' }
  },
  {
    path: ':id',
    component: DeploymentLocationDetailsComponent
  },
  {
    path: 'edit/:id',
    component: DeploymentEditDetailsComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeploymentRoutingModule {
}

