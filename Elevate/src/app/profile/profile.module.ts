import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularEditorModule } from '@kolkov/angular-editor';
import { CommonModule } from '@angular/common';
import { CoreModule } from './../core/core.module';
import { EffectsModule } from '@ngrx/effects';
import { ExamModule } from '../exam/exam.module';
import { FileUploadModule } from './../file-upload/file-upload.module';
import { FreelancerAddressComponent } from './freelancer-address/freelancer-address.component';
import { FreelancerAppearanceComponent } from './freelancer-appearance/freelancer-appearance.component';
import { FreelancerContractComponent } from './freelancer-contract/freelancer-contract.component';
import { FreelancerContractTypeComponent } from './freelancer-contract-type/freelancer-contract-type.component';
import { FreelancerEducationComponent } from './freelancer-education/freelancer-education.component';
import { FreelancerEmploymentInfoComponent } from './freelancer-employment-info/freelancer-employment-info.component';
import { FreelancerLegalComponent } from './freelancer-legal/freelancer-legal.component';
import { FreelancerLegalDocumentsComponent } from './freelancer-legal-documents/freelancer-legal-documents.component';
import { FreelancerLegalIdentityCardComponent } from './freelancer-legal-identity-card/freelancer-legal-identity-card.component';
import { FreelancerMasterComponent } from './freelancer-master/freelancer-master.component';
import { FreelancerQualificationComponent } from './freelancer-qualification/freelancer-qualification.component';
import { FreelancerQualificationItemComponent } from './freelancer-qualification-item/freelancer-qualification-item.component';
import { FreelancerReferenceComponent } from './freelancer-reference/freelancer-reference.component';
import { FreelancerRolesComponent } from './freelancer-roles/freelancer-roles.component';
import { FreelancerSkillsComponent } from './freelancer-skills/freelancer-skills.component';
import { FreelancerTrainingComponent } from './freelancer-training/freelancer-training.component';
import { FreelancerWorkHistoryComponent } from './freelancer-work-history/freelancer-work-history.component';
import { IdentityDocumentsService } from '../services/identity-documents.service ';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { NgModule } from '@angular/core';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { OnBoardingButtonComponent } from './on-boarding-button/on-boarding-button.component';
import { OnBoardingSummaryComponent } from './on-boarding-summary/on-boarding-summary.component';
import { OnboardingWelcomeComponent } from './onboarding-welcome/onboarding-welcome.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ProfileAppearanceComponent } from './profile-appearance/profile-appearance.component';
import { ProfileCertificateComponent } from './profile-certificate/profile-certificate.component';
import { ProfileCommentComponent } from './profile-comment/profile-comment.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileConfirmationComponent } from './profile-confirmation/profile-confirmation.component';
import { ProfileContractFreelancerComponent } from './profile-contract-freelancer/profile-contract-freelancer.component';
import { ProfileContractTaxCardComponent } from './profile-contract-tax-card/profile-contract-tax-card.component';
import { ProfileContractTypeFreelancerComponent } from './profile-contract-type-freelancer/profile-contract-type-freelancer.component';
import { ProfileContractTypeTaxCardComponent } from './profile-contract-type-tax-card/profile-contract-type-tax-card.component';
import { ProfileDocumentComponent } from './profile-document/profile-document.component';
import { ProfileEffect } from './state/profile.effects';
import { ProfileGtcDocumentsComponent } from './profile-gtc-documents/profile-gtc-documents.component';
import { ProfileGtcDocumentsModalComponent } from './profile-gtc-documents-modal/profile-gtc-documents-modal.component';
import { ProfileGtcTableComponent } from './profile-gtc-table/profile-gtc-table.component';
import { ProfileLayoutComponent } from './profile-layout/profile-layout.component';
import { ProfileLegalComponent } from './profile-legal/profile-legal.component';
import { ProfileMasterComponent } from './profile-master/profile-master.component';
import { ProfilePhotoComponent } from './profile-photo/profile-photo.component';
import { ProfileQualificationsComponent } from './profile-qualifications/profile-qualifications.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { QualificationService } from '../services/qualification.service';
import { ReferenceService } from './../services/reference.service';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { WorkHistoryService } from '../services/work-history.service';
import { reducer } from './state/profile.reducer';

@NgModule({
  declarations: [OnboardingWelcomeComponent, FreelancerRolesComponent, FreelancerMasterComponent, FreelancerContractComponent, FreelancerWorkHistoryComponent, FreelancerLegalIdentityCardComponent, FreelancerLegalDocumentsComponent, FreelancerAddressComponent, FreelancerEmploymentInfoComponent, FreelancerAppearanceComponent, ProfilePhotoComponent, FreelancerQualificationComponent, FreelancerReferenceComponent, ProfileDocumentComponent, FreelancerQualificationItemComponent, FreelancerLegalComponent, ProfileComponent, FreelancerContractTypeComponent, ProfileCertificateComponent, ProfileContractTypeFreelancerComponent, ProfileContractTypeTaxCardComponent, ProfileMasterComponent, ProfileGtcDocumentsComponent, ProfileGtcTableComponent, ProfileGtcDocumentsModalComponent, ProfileLayoutComponent, ProfileCommentComponent, ProfileAppearanceComponent, ProfileQualificationsComponent, ProfileLegalComponent, ProfileContractFreelancerComponent, ProfileContractTaxCardComponent, OnBoardingSummaryComponent, OnBoardingButtonComponent, ProfileConfirmationComponent,FreelancerEducationComponent, FreelancerTrainingComponent, FreelancerSkillsComponent],
  exports: [OnboardingWelcomeComponent, FreelancerRolesComponent, FreelancerMasterComponent, FreelancerContractComponent, FreelancerWorkHistoryComponent, FreelancerLegalIdentityCardComponent, FreelancerLegalDocumentsComponent, FreelancerAddressComponent, FreelancerEmploymentInfoComponent, FreelancerAppearanceComponent, ProfilePhotoComponent, FreelancerQualificationComponent, FreelancerReferenceComponent, ProfileDocumentComponent, FreelancerQualificationItemComponent, FreelancerLegalComponent, ProfileComponent, FreelancerContractTypeComponent, ProfileCertificateComponent, ProfileContractTypeFreelancerComponent, ProfileContractTypeTaxCardComponent, ProfileMasterComponent, ProfileGtcDocumentsComponent, ProfileGtcTableComponent, ProfileGtcDocumentsModalComponent, ProfileLayoutComponent, ProfileCommentComponent, ProfileAppearanceComponent, ProfileQualificationsComponent, ProfileLegalComponent, ProfileContractFreelancerComponent, ProfileContractTaxCardComponent, OnBoardingSummaryComponent, OnBoardingButtonComponent, ProfileConfirmationComponent,FreelancerEducationComponent, FreelancerTrainingComponent, FreelancerSkillsComponent],
  imports: [
    CommonModule,
    CoreModule,
    ProfileRoutingModule,
    StoreModule.forFeature('profile', reducer),
    EffectsModule.forFeature(
      [ProfileEffect]
    ),
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FileUploadModule,
    MatRadioModule,
    MatTableModule,
    MatMenuModule,
    ExamModule,
    PdfViewerModule,
    MatDialogModule,
    NgxIntlTelInputModule,
    AngularEditorModule
  ],
  providers: [ReferenceService, QualificationService, IdentityDocumentsService, WorkHistoryService]
})
export class ProfileModule { }
