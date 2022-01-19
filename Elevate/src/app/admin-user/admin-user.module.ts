import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminUserRoutingModule } from './admin-user-routing.module';
import { BarRatingModule } from "ngx-bar-rating";
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import { EffectsModule } from '@ngrx/effects';
import { FreelancerDetailComponent } from './freelancer-detail/freelancer-detail.component';
import { FreelancerUserAddressComponent } from './freelancer-user-address/freelancer-user-address.component';
import { FreelancerUserContractComponent } from './freelancer-user-contract/freelancer-user-contract.component';
import { FreelancerUserIdentityComponent } from './freelancer-user-identity/freelancer-user-identity.component';
import { FreelancerUserMasterComponent } from './freelancer-user-master/freelancer-user-master.component';
import { FreelancerUserQualificationComponent } from './freelancer-user-qualification/freelancer-user-qualification.component';
import { FreelancerUserRateComponent } from './freelancer-user-rate/freelancer-user-rate.component';
import { FreelancerUserReferenceComponent } from './freelancer-user-reference/freelancer-user-reference.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NgImageSliderModule } from 'ng-image-slider';
import { NgModule } from '@angular/core';
import { ProfileModule } from './../profile/profile.module';
import { SearchPanelModule } from '../search-panel/search-panel.module';
import { StoreModule } from '@ngrx/store';
import { UserCreateComponent } from './user-create/user-create.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserEffect } from './state/user.effects';
import { UserListComponent } from './user-list/user-list.component';
import { UserMappingService } from './services/user-mapping.service';
import { reducer } from './state/user.reducer';

@NgModule({
  declarations: [
    UserListComponent,
    UserCreateComponent,
    UserDetailComponent,
    FreelancerDetailComponent,
    FreelancerUserMasterComponent,
    FreelancerUserIdentityComponent,
    FreelancerUserContractComponent,
    FreelancerUserAddressComponent,
    FreelancerUserQualificationComponent,
    FreelancerUserReferenceComponent,
    FreelancerUserRateComponent
  ],
  exports: [UserDetailComponent,
    FreelancerDetailComponent,
    FreelancerUserMasterComponent,
    FreelancerUserIdentityComponent,
    FreelancerUserContractComponent,
    FreelancerUserAddressComponent,
    FreelancerUserQualificationComponent,
    FreelancerUserReferenceComponent,
    FreelancerUserRateComponent],
  imports: [
    CommonModule,
    CoreModule,
    ReactiveFormsModule,
    FormsModule,
    StoreModule.forFeature('users', reducer),
    EffectsModule.forFeature([UserEffect]),
    MatSidenavModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatMenuModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    AdminUserRoutingModule,
    SearchPanelModule,
    BarRatingModule,
    NgImageSliderModule,
    ProfileModule,
    GoogleMapsModule
  ],
  providers: [UserMappingService],
})
export class AdminUserModule { }
