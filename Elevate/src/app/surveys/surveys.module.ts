import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { CoreModule } from './../core/core.module';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { NgModule } from '@angular/core';
import { SurveyDetailsButtonComponent } from './survey-details-button/survey-details-button.component';
import { SurveyEditModalComponent } from './survey-edit-modal/survey-edit-modal.component';
import { SurveyService } from '../services/servey.service';

@NgModule({
  declarations: [SurveyDetailsButtonComponent, SurveyEditModalComponent],
  exports: [SurveyDetailsButtonComponent],
  imports: [
    CommonModule,
    CoreModule,
    MatButtonModule,
    MatRadioModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [SurveyService]
})
export class SurveysModule { }
