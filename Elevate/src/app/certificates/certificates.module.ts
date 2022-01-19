import { CertificateDetailsComponent } from './certificate-details/certificate-details.component';
import { CertificateDetailsPassedComponent } from './certificate-details-passed/certificate-details-passed.component';
import { CertificateEffect } from './state/certificates.effect';
import { CertificateListComponent } from './certificate-list/certificate-list.component';
import { CertificateTileComponent } from './certificate-tile/certificate-tile.component';
import { CertificatesRoutingModule } from './certificates-routing.module';
import { CommonModule } from '@angular/common';
import { CoreModule } from './../core/core.module';
import { EffectsModule } from '@ngrx/effects';
import { ExamModule } from './../exam/exam.module';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SearchPanelModule } from './../search-panel/search-panel.module';
import { StoreModule } from '@ngrx/store';
import { TrainingModule } from './../training/training.module';
import { reducer } from './state/certificates.reducer';

@NgModule({
  declarations: [CertificateListComponent, CertificateTileComponent, CertificateDetailsPassedComponent, CertificateDetailsComponent],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    CertificatesRoutingModule,
    StoreModule.forFeature('certificates', reducer),
    EffectsModule.forFeature([CertificateEffect]),
    CoreModule,
    SearchPanelModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTooltipModule,
    ExamModule,
    TrainingModule
  ]
})
export class CertificatesModule { }
