import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ApprovalChangeComponent } from './approval-change/approval-change.component';
import { ApprovalCommentComponent } from './approval-comment/approval-comment.component';
import { ApprovalEffect } from './state/approval.effect';
import { ApprovalListComponent } from './approval-list/approval-list.component';
import { ApprovalLogsListComponent } from './approval-logs-list/approval-logs-list.component';
import { ApprovalPhotoComponent } from './approval-photo/approval-photo.component';
import { ApprovalProfileComponent } from './approval-profile/approval-profile.component';
import { ApprovalRequestMappingService } from './../services/mapping-services/apparoval-request-mapping.service';
import { ApprovalRequestService } from '../services/approval-request.service';
import { ApprovalRoutingModule } from './approval-routing.module';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import { EffectsModule } from '@ngrx/effects';
import { EventLogMappingService } from '../services/mapping-services/event-log-mapping.service';
import { EventLogService } from '../services/event-log.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MessageService } from '../services/messages.service';
import { NgModule } from '@angular/core';
import { ProfileModule } from '../profile/profile.module';
import { StoreModule } from '@ngrx/store';
import { reducer } from './state/approval.reducer';
import { ApprovalDocumentComponent } from './approval-document/approval-document.component';
import { ApprovalNewFreelancerComponent } from './approval-new-freelancer/approval-new-freelancer.component';
import { ApprovalAdminFreelancerProfileComponent } from './approval-admin-freelancer-profile/approval-admin-freelancer-profile.component';
import {SearchPanelModule} from "../search-panel/search-panel.module";

@NgModule({
  declarations: [ApprovalListComponent, ApprovalLogsListComponent, ApprovalProfileComponent, ApprovalCommentComponent, ApprovalChangeComponent, ApprovalPhotoComponent, ApprovalDocumentComponent, ApprovalNewFreelancerComponent, ApprovalAdminFreelancerProfileComponent],
    imports: [
        CommonModule,
        ApprovalRoutingModule,
        CoreModule,
        StoreModule.forFeature('approval', reducer),
        EffectsModule.forFeature([ApprovalEffect]),
        FormsModule,
        ReactiveFormsModule,
        MatTableModule,
        MatButtonModule,
        MatMenuModule,
        MatTabsModule,
        MatFormFieldModule,
        MatInputModule,
        ProfileModule,
        SearchPanelModule
    ],
  providers: [
    ApprovalRequestService,
    ApprovalRequestMappingService,
    EventLogService,
    EventLogMappingService,
    MessageService
  ]
})
export class ApprovalModule { }
