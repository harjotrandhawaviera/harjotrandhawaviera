import { CommonModule } from '@angular/common';
import { CoreModule } from './../core/core.module';
import { ExamAnswersComponent } from './exam-answers/exam-answers.component';
import { ExamCarouselComponent } from './exam-carousel/exam-carousel.component';
import { ExamDescriptionComponent } from './exam-description/exam-description.component';
import { ExamModalComponent } from './exam-modal/exam-modal.component';
import { ExamQuestionnaireComponent } from './exam-questionnaire/exam-questionnaire.component';
import { ExamResultComponent } from './exam-result/exam-result.component';
import { ExamRoutingModule } from './exam-routing.module';
import { ExamSlideComponent } from './exam-slide/exam-slide.component';
import { ExamSummaryComponent } from './exam-summary/exam-summary.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [ExamModalComponent, ExamDescriptionComponent, ExamQuestionnaireComponent, ExamSummaryComponent, ExamResultComponent, ExamCarouselComponent, ExamSlideComponent, ExamAnswersComponent],
  exports: [ExamModalComponent, ExamDescriptionComponent, ExamQuestionnaireComponent, ExamSummaryComponent, ExamResultComponent],
  imports: [
    CommonModule,
    ExamRoutingModule,
    CoreModule,
    MatButtonModule,
    MatDialogModule,
    MatCheckboxModule
  ]
})
export class ExamModule { }
