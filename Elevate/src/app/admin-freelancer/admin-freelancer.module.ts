import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminFreelancerRoutingModule } from './admin-freelancer-routing.module';
import { AdminUserModule } from '../admin-user/admin-user.module';
import { BarRatingModule } from 'ngx-bar-rating';
import { CommonModule } from '@angular/common';
import { CoreModule } from './../core/core.module';
import { EffectsModule } from '@ngrx/effects';
import { FreelancerAdvanceListComponent } from './freelancer-advance-list/freelancer-advance-list.component';
import { FreelancerEffect } from './state/freelancer.effect';
import { FreelancerListComponent } from './freelancer-list/freelancer-list.component';
import { FreelancerOnboardingProfileComponent } from './freelancer-onboarding-profile/freelancer-onboarding-profile.component';
import { FreelancerTileComponent } from './freelancer-tile/freelancer-tile.component';
import { IdentityDocumentsService } from '../services/identity-documents.service ';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { NgModule } from '@angular/core';
import { ProfileModule } from './../profile/profile.module';
import { QualificationService } from '../services/qualification.service';
import { ReferenceService } from './../services/reference.service';
import { RouterModule } from '@angular/router';
import { SearchPanelModule } from './../search-panel/search-panel.module';
import { StoreModule } from '@ngrx/store';
import { WorkHistoryService } from '../services/work-history.service';
import { reducer } from './state/freelancer.reducer';
import { FreelancerPopupComponent } from './freelancer-popup/freelancer-popup.component';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {PdfViewerModule} from "ng2-pdf-viewer";
import { PreviewDownloadPopupComponent } from './preview-download-popup/preview-download-popup.component';

@NgModule({
  declarations: [FreelancerListComponent, FreelancerTileComponent, FreelancerOnboardingProfileComponent, FreelancerAdvanceListComponent, FreelancerPopupComponent, PreviewDownloadPopupComponent],
  imports: [
    CommonModule,
    CoreModule,
    StoreModule.forFeature('freelancers', reducer),
    EffectsModule.forFeature([FreelancerEffect]),
    SearchPanelModule,
    AdminFreelancerRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatMenuModule,
    BarRatingModule,
    AdminUserModule,
    MatTabsModule,
    ProfileModule,
    MatTableModule,
    MatCheckboxModule,
    MatIconModule,
    MatDialogModule,
    DragDropModule,
    PdfViewerModule
  ],
  providers: [ReferenceService, QualificationService, IdentityDocumentsService, WorkHistoryService]
})
export class AdminFreelancerModule {}
