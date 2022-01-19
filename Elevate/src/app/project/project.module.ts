import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

import { AdditionalCostComponent } from './additional-cost/additional-cost.component';
import { CommonModule } from '@angular/common';
import { CoreModule } from './../core/core.module';
import { CustomPropertiesValuesComponent } from './custom-properties-values/custom-properties-values.component';
import { EffectsModule } from '@ngrx/effects';
import { FeedbackQuestionsComponent } from './feedback-questions/feedback-questions.component';
import { FileUploadModule } from './../file-upload/file-upload.module';
import { HttpClient } from '@angular/common/http';
import { JobsModule } from '../jobs/jobs.module';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NgModule } from '@angular/core';
import { ProjectAccountingSummaryComponent } from './project-accounting-summary/project-accounting-summary.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { ProjectDetailEvaluationComponent } from './project-detail-evaluation/project-detail-evaluation.component';
import { ProjectDetailGeneralComponent } from './project-detail-general/project-detail-general.component';
import { ProjectDetailGeneralEditComponent } from './project-detail-general-edit/project-detail-general-edit.component';
import { ProjectDetailReportComponent } from './project-detail-report/project-detail-report.component';
import { ProjectDetailReportEditComponent } from './project-detail-report-edit/project-detail-report-edit.component';
import { ProjectDetailSummaryComponent } from './project-detail-summary/project-detail-summary.component';
import { ProjectDocumentsComponent } from './project-documents/project-documents.component';
import { ProjectEditComponent } from './project-edit/project-edit.component';
import { ProjectEffect } from './state/project.effect';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectRevenueSummaryComponent } from './project-revenue-summary/project-revenue-summary.component';
import { ProjectRoutingModule } from './project-routing.module';
import { RouterModule } from '@angular/router';
import { SalesSlotsComponent } from './sales-slots/sales-slots.component';
import { SearchPanelModule } from './../search-panel/search-panel.module';
import { StoreModule } from '@ngrx/store';
import { reducer } from './state/project.reducer';
import { MatIconModule } from '@angular/material/icon';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { TargetBudgetComponent } from './target-budget/target-budget.component';
import {AdminClientModule} from "../admin-client/admin-client.module";

@NgModule({
    declarations: [
        ProjectListComponent,
        ProjectDetailComponent,
        ProjectEditComponent,
        ProjectDetailGeneralComponent,
        CustomPropertiesValuesComponent,
        ProjectDocumentsComponent,
        ProjectDetailSummaryComponent,
        ProjectAccountingSummaryComponent,
        ProjectDetailReportComponent,
        SalesSlotsComponent,
        FeedbackQuestionsComponent,
        ProjectRevenueSummaryComponent,
        AdditionalCostComponent,
        ProjectDetailGeneralEditComponent,
        ProjectDetailReportEditComponent,
        ProjectDetailEvaluationComponent,
        TargetBudgetComponent],
    imports: [
        CommonModule,
        CoreModule,
        StoreModule.forFeature('projects', reducer),
        EffectsModule.forFeature(
            [ProjectEffect]
        ),
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        ProjectRoutingModule,
        MatSidenavModule,
        MatPaginatorModule,
        MatTableModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatButtonModule,
        MatSortModule,
        MatMenuModule,
        MatExpansionModule,
        MatListModule,
        SearchPanelModule,
        MatNativeDateModule,
        MatDatepickerModule,
        MatCheckboxModule,
        FileUploadModule,
        JobsModule,
        MatIconModule,
        AngularEditorModule,
        AdminClientModule
    ],
    exports: [
        ProjectDocumentsComponent
    ]
})
export class ProjectModule { }
