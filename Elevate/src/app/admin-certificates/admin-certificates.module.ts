import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminCertificatesRoutingModule } from './admin-certificates-routing.module';
import { CertificateDetailsComponent } from './certificate-details/certificate-details.component';
import { CertificateEffect } from './state/certificates.effect';
import { CertificateListComponent } from './certificate-list/certificate-list.component';
import { CertificateTileComponent } from './certificate-tile/certificate-tile.component';
import { CommonModule } from '@angular/common';
import { CoreModule } from './../core/core.module';
import { EffectsModule } from '@ngrx/effects';
import { ExamModule } from './../exam/exam.module';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SearchPanelModule } from './../search-panel/search-panel.module';
import { StoreModule } from '@ngrx/store';
import { TrainingModule } from '../training/training.module';
import { reducer } from './state/certificates.reducer';

@NgModule({
  declarations: [CertificateListComponent, CertificateTileComponent, CertificateDetailsComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AdminCertificatesRoutingModule,
    StoreModule.forFeature('admin-certificates', reducer),
    EffectsModule.forFeature([CertificateEffect]),
    CoreModule,
    SearchPanelModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatCheckboxModule,
    ExamModule,
    TrainingModule
  ]
})
export class AdminCertificatesModule { }
