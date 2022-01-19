/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/naming-convention */

import * as fromCurrentUser from '../../root-state/user-state';
import * as fromJob from '../state';
import * as fromJobAction from '../state/job.actions';
import * as moment from 'moment';

import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {Observable, of} from 'rxjs';

import {ConfirmBoxComponent} from '../../core/confirm-box/confirm-box.component';
import {MatDialog} from '@angular/material/dialog';
import {ReasonBoxComponent} from '../../core/reason-box/reason-box.component';
import {StorageService} from '../../services/storage.service';
import {Store} from '@ngrx/store';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '../../services/translate.service';

@Component({
  selector: 'app-jobs-invite-detail',
  templateUrl: './jobs-invite-detail.component.html',
  styleUrls: ['./jobs-invite-detail.component.scss']
})
export class JobsInviteDetailComponent implements OnInit {
  buttonsArea = false;
  freelancerId: string | undefined = '';
  paramId: any;
  role_id: any;
  Type: string | null | undefined;
  freelancerJobOfferList: any;
  isChangedBlock = -1;
  loading$: Observable<boolean> = of(false);
  paginator: any;
  selectedTenders: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private store: Store<fromJob.State>,
    private dialog: MatDialog,
    private translateService: TranslateService,
    private toastrService: ToastrService,
    private storageService: StorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const isMatched = this.storageService.get('freelancerIsMatched');
    this.route.paramMap.subscribe((params: ParamMap) => {
      // @ts-ignore
      this.paramId = +params.get('id');
      this.role_id = params.get('role_id');
    });
    this.store.select(fromCurrentUser.getCurrentUserInfo).subscribe((res: any) => {
      if (res) {
        this.freelancerId = res.freelancer_id;
        this.store.dispatch(new fromJobAction.LoadFreelancerJobDetail({ id: this.paramId, fid: this.freelancerId, role_id: this.role_id, is_matched: isMatched }));
        this.store.select(fromJob.getFreelancerJobOfferDetails).subscribe((freelanceData: any) => {
          if (freelanceData.data) {
            this.freelancerJobOfferList = {...freelanceData.data};
            this.freelancerJobOfferList.card = freelanceData?.data && freelanceData?.data?.tenders.data?.map((result: any) => ({
                tenderId: result?.id,
                Until: result?.invalid_at,
                startTime: moment(result?.shift_start_time, 'HHmmss').format('HH:mm'),
                endTime: moment(result?.shift_end_time, 'HHmmss').format('HH:mm'),
                daily_rate_max: result?.rate,
                registering: result?.snapshots?.incentive_model?.checkin,
                SalesReport: result?.snapshots?.incentive_model?.sales_report,
                documentation: result?.snapshots?.incentive_model?.picture_documentation,
                wages: result?.snapshots?.assignment?.wage,
                shift_name: result?.shift_name
              }));
            this.freelancerJobOfferList.Description = freelanceData?.data?.job_info.data.description;
            this.freelancerJobOfferList.GeneralBriefing = freelanceData?.data?.job_info.data.project?.data?.briefing,
              this.paginator = this.freelancerJobOfferList?.card?.length;
          }
        });
      }
    });
  }

  pageChange(event: any) {
    const update = {
      pageSize: event.pageSize,
      pageIndex: event.pageIndex + 1,
    };
  }

  publishOffer() {
    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      data: {
        type: 'warning',
        title: this.translateService.instant(
          'jobs.freelancer.details.submit-offer.title'
        ),
        message: this.translateService.instant(
          'jobs.freelancer.details.submit-offer.message'
        ),
        cancelCode: 'job.buttons.cancel' ,
        confirmCode: 'common.buttons.yes-submit-offer',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(new fromJobAction.LoadFreelancerJobDetailSubmitOffers(this.selectedTenders));
        this.store.select(fromJob.getFreelancerJobOfferSubject).subscribe((data: any) => {
          if (data) {
            this.toastrService.success(this.translateService.instant('notification.post.projects.success'));
            this.router.navigate(['jobs', 'freelancer', 'invite']);
          }
        });
      }
    });
  }

  anotherQuestion() {
    this.dialog.open(ReasonBoxComponent, {
      data: {
        type: 'warning',
        title: this.translateService.instant(
          'jobs.freelancer.details.inquery.title'
        ),
        message: this.translateService.instant(
          'jobs.freelancer.details.inquery.message'
        ),
        label: 'jobs.freelancer.details.inquery.placeholder',
        needReason: true,
        cancelCode: 'job.buttons.cancel',
        confirmCode: 'common.buttons.yes-submit',
      },
    }).afterClosed().subscribe(res => {
      if (res) {
        const reason = res.reason;
        const tenderIds = this.selectedTenders.map((res1) => res1.tender_id);
        this.store.dispatch(new fromJobAction.LoadFreelancerJobDetailQuestion(
          {
            content: reason,
            subject: this.freelancerJobOfferList?.job_name,
            tender_ids: tenderIds
          }, this.freelancerJobOfferList.job_id));
        this.store.select(fromJob.getFreelancerJobOfferQuestion).subscribe((data: any) => {
          if (data) {
            this.router.navigate(['jobs', 'freelancer', 'invite']);
          }
        });
      }
    });
  }

  rejectedTenders() {
    this.dialog.open(ReasonBoxComponent, {
      data: {
        type: 'warning',
        title: this.translateService.instant(
          'jobs.freelancer.details.reject.title'
        ),
        message: this.translateService.instant(
          'jobs.freelancer.details.reject.message'
        ),
        label: 'jobs.freelancer.details.reject.placeholder',
        needReason: true,
        cancelCode: 'job.buttons.cancel',
        confirmCode: 'common.buttons.yes-reject',
      },
    }).afterClosed().subscribe(res => {
      if (res) {
        const reason = res.reason;
        this.selectedTenders.map((res1) => {
          if (res1.tender_id) {
            this.store.dispatch
            (new fromJobAction.LoadFreelancerJobDetailRejected({ freelancer_id: res1.freelancer_id, reason, tender_id: res1.tender_id }));
          }
        });
      }
      this.store.select(fromJob.getFreelancerJobOfferReject).subscribe((data: any) => {
        if (data) {
          this.router.navigate(['jobs', 'freelancer', 'invite']);
        }
      });
    });
  }

  activateClass(subModule: any, index: number){
    subModule.active = !subModule.active;
    if (subModule.active) {
      this.selectedTenders = [ ...this.selectedTenders, { freelancer_id: this.freelancerId,
        tender_id: subModule.tenderId }];
    }
    else {
      const findIndex = this.selectedTenders.findIndex((res) => res.tender_id === subModule.tenderId);
      this.selectedTenders = [...this.selectedTenders.slice(0, findIndex), ...this.selectedTenders.slice(findIndex + 1)];
    }
    if (this.selectedTenders.length > 0) {
      this.buttonsArea = true;
    }
    else {
      this.buttonsArea = false;
    }
  }

}
