import { RouterModule, Routes } from '@angular/router';

import { CreateTenderComponent } from './create-tender/create-tender.component';
import { EditTenderComponent } from './edit-tender/edit-tender.component';
import { NgModule } from '@angular/core';
import { TenderDetailComponent } from './tender-detail/tender-detail.component';
import { TendersListComponent } from './tenders-list/tenders-list.component';
import { OffersComponent } from './offers/offers.component';
import { OfferDetailsComponent } from './offer-details/offer-details.component';

const routes: Routes = [
  {
    path: 'all',
    component: TendersListComponent,
  },
  {
    path: 'offers',
    component: OffersComponent,
  },
  {
    path: 'offers/:id',
    component: OfferDetailsComponent,
  },
  {
    path: ':id',
    component: TenderDetailComponent,
  },
  {
    path: 'create/:id',
    component: CreateTenderComponent,
  },
  {
    path: 'edit/:id',
    component: EditTenderComponent,
  },
  {
    path: 'adv/:id/role/:role_id',
    component: TenderDetailComponent,
    data: { mode: 'Job' }
  },
  {
    path: '',
    pathMatch: 'exact',
    redirectTo: 'all'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TendersRoutingModule { }
