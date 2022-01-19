import * as fromAssignment from './../state';
import * as fromAssignmentAction from './../state/assignment.actions';
import * as fromUser from './../../root-state/user-state';

import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { take, takeWhile } from 'rxjs/operators';

import { AllowedActions } from '../../constant/allowed-actions.constant';
import { AssignmentVM } from '../../model/assignment.model';
import { FileExportService } from '../../services/file-export.service';
import { FormConfig } from '../../constant/forms.constant';
import { MatDialog } from '@angular/material/dialog';
import { UserVM } from '../../model/user.model';
import { TranslateService } from '../../services/translate.service';
import { ToastrService } from 'ngx-toastr';
import { SurveyLinkConfirmationComponent } from '../../core/survey-link-confirmation/survey-link-confirmation.component';
import {PreviewDownloadPopupComponent} from '../../admin-freelancer/preview-download-popup/preview-download-popup.component';

@Component({
  selector: 'app-assignment-detail',
  templateUrl: './assignment-detail.component.html',
  styleUrls: ['./assignment-detail.component.scss'],
})
export class AssignmentDetailComponent implements OnInit {
  componentActive = true;
  id?: string | null;
  mode?: string;

  assignment$: Observable<AssignmentVM | undefined> = of(undefined);
  assignment: AssignmentVM | undefined = undefined;
  hasFullAccess$: Observable<boolean> = of(false);
  enabledDocTypes: any[];
  reportStatuses: any[];
  additionalCTI: string | undefined;
  loggedInUser: UserVM | undefined = undefined;
  isClientUser: boolean = false;
  isFieldUser: boolean = false;
  showDetails: boolean = false;
  hasCreator: boolean = false;
  bookedFreelancer: any;
  assignmentJob: any;
  surveyData: any;
  survey: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private translateService: TranslateService,
    private fileExportService: FileExportService,
    public dialog: MatDialog,
    private store: Store<fromAssignment.State>,
    private userStore: Store<fromUser.State>,
    private toastrService: ToastrService
  ) {
    this.enabledDocTypes =
      [...FormConfig.invoices.preparation.requiredDocumentTypes.freelancer] ||
      [];
    this.reportStatuses = [...FormConfig.reports.statuses] || [];
  }

  ngOnInit(): void {
    this.retrieveIdFromParameters();
    this.assignment$ = this.store.pipe(
      select(fromAssignment.getAssignmentDetail),
      takeWhile(() => this.componentActive)
    );

    this.userStore
      .pipe(
        select(fromUser.getCurrentUserInfo),
        takeWhile(() => this.componentActive)
      )
      .subscribe((res) => {
        this.loggedInUser = res ? res : undefined;
      });

    this.isClientUser = this.loggedInUser?.role === 'client';
    this.isFieldUser = this.loggedInUser?.role === 'field';
    this.assignment$.subscribe((res) => {
      if (res) {
        this.assignment = res;
        this.surveyData = res;
        this.store.dispatch(new fromAssignmentAction.GetSurveyLink(this.surveyData));
        this.additionalCTI = res.contract_type_identifier
          ? res.contract_type_identifier
          : '';
        this.hasCreator = res.revenues[0] && (res.revenues[0].creator || res.revenues[0].created_at);
        if (this.assignment.freelancer_id) {
          this.bookedFreelancer =
            this.assignment.freelancers &&
            this.assignment.freelancers.find(
              (x: any) => x.id === this.assignment?.freelancer_id
            );
        }
        this.assignmentJob = res.date.data.job.data;
      }
      this.store.select(fromAssignment.getSurveyLink).subscribe((data: any) => {
        this.survey = {
          checkin_survey: data?.data?.checkin_survey,
          checkout_survey: data?.data?.checkout_survey
        };
      });
    });

    if (
      !(this.isClientUser || this.isFieldUser) &&
      !this.assignment?.questionnaire &&
      !this.enabledDocTypes.includes('questionnaire')
    ) {
      this.enabledDocTypes.push('questionnaire');
    }

    this.hasFullAccess$ = this.userStore.pipe(
      select(fromUser.isAllowed, {
        permissions: AllowedActions['manage-projects'],
      }),
      takeWhile(() => this.componentActive)
    );
  }

  retrieveIdFromParameters() {
    this.route.data.pipe(take(1)).subscribe((res) => {
      this.mode = res.mode;
    });
    this.route.paramMap.pipe(take(1)).subscribe((params) => {
      this.loadDetail(params);
    });
  }

  loadDetail(params: ParamMap) {
    if (params && params.get('id')) {
      this.id = params.get('id');
      if (this.id) {
        this.store.dispatch(
          new fromAssignmentAction.LoadAssignmentDetail(this.id)
        );
      }
    }
  }

  cancelBooking() {}

  navigateToTender() {}

  downloadSedcard() {}

  downloadDocument(doc: any) {
    if (doc?.mime.includes('pdf')) {
      this.dialog.open(PreviewDownloadPopupComponent, {
        data: {
          pdf: doc
        },
        disableClose: true
      });
    }
    else if (doc?.mime.includes('image')) {
      this.dialog.open(PreviewDownloadPopupComponent, {
        data: {
          image: doc
        },
        disableClose: true
      });
    }
    else {
      this.dialog.open(PreviewDownloadPopupComponent, {
        data: {
          pdf: doc
        },
        disableClose: true
      });
    }

  }

  showRevenueDetail(val: string) {
    if (val === 'more') {
      this.showDetails = true;
    } else {
      this.showDetails = false;
    }
  }

  updateLink(assignmentId: any, freelancerId: any) {
    const dialogRef = this.dialog.open(SurveyLinkConfirmationComponent, {
      data: {
        type: 'warning',
        title: this.translateService.instant(
          'assignment.buttons.confirmOffer'
        ),
        assignment: this.survey,
        checkInPlaceholder: this.translateService.instant('assignment.confirm-offer.placeholder.check_in'),
        checkOutPlaceholder: this.translateService.instant('assignment.confirm-offer.placeholder.check_out'),
        cancelCode: 'assignment.buttons.abort' ,
        confirmCode: 'assignment.buttons.accept',
        updateLink: true
      },
    }).afterClosed().subscribe((result) => {
      if (result) {
          const data: any = {
            assignment_id: assignmentId,
            freelancer_id: freelancerId,
            checkin_survey: result.checkInSurvey,
            checkout_survey: result.checkOutSurvey
          };
          this.store.dispatch(new fromAssignmentAction.UpdateSurveyLink(data));
          this.store.dispatch(new fromAssignmentAction.GetSurveyLink(this.surveyData));
          this.store.select(fromAssignment.getSurveyLink).subscribe((data: any) => {
          this.survey = {
            checkin_survey: data?.data?.checkin_survey,
            checkout_survey: data?.data?.checkout_survey
          };
        });
          this.toastrService.success(this.translateService.instant('assignment.buttons.successMessage'));
      }
    });
  }
}
