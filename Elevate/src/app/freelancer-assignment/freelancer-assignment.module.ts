import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SearchPanelModule } from '../search-panel/search-panel.module';
import { CoreModule } from '../core/core.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { StoreModule } from '@ngrx/store';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { FreelancerAssignmentComponent } from './freelancer-assignment.component';
import { FreelancerAssignmentRoutingModule } from './freelancer-assignment-routing.module';
import { featureKey, reducer } from '../freelancer-assignment/+state/freelancer-assignment.reducer';
import { EffectsModule } from '@ngrx/effects';
import { FreelancerAssignmentEffect } from './+state/freelancer-assignment.effect';
import { FreelancerAssignmentDetailsComponent } from './freelancer-assignment-details/freelancer-assignment-details.component';
import { JobsModule } from '../jobs/jobs.module';

@NgModule({
  declarations: [FreelancerAssignmentComponent, FreelancerAssignmentDetailsComponent],
  imports: [
    CommonModule,
    FreelancerAssignmentRoutingModule,
    SearchPanelModule,
    CoreModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatInputModule,
    MatSelectModule,
    MatMenuModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatIconModule,
    MatNativeDateModule,
    MatDialogModule,
    JobsModule,
    StoreModule.forFeature(featureKey, reducer),
    EffectsModule.forFeature(
      [FreelancerAssignmentEffect]
    ),
  ],
  providers: [MatDatepickerModule, DatePipe]
})
export class FreelancerAssignmentModule {
}
