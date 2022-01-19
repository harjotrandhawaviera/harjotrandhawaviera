/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/naming-convention */

import * as fromCurrentUser from '../../root-state/user-state';
import * as fromJob from '../state';
import * as fromJobAction from '../state/job.actions';
import * as moment from 'moment';

import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {Component, Input, OnInit} from '@angular/core';
import { Observable, of } from 'rxjs';

import { ConfirmBoxComponent } from '../../core/confirm-box/confirm-box.component';
import { MatDialog } from '@angular/material/dialog';
import { OptionVM } from '../../model/option.model';
import { ReasonBoxComponent } from '../../core/reason-box/reason-box.component';
import {StorageService} from '../../services/storage.service';
import { Store } from '@ngrx/store';
import {ToastrService} from 'ngx-toastr';
import { TranslateService } from '../../services/translate.service';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss']
})
export class JobDetailsComponent implements OnInit {
  buttonsArea = false;
  freelancerId: string | undefined = '';
  paramId: any;
  Type: string | null | undefined;
  freelancerJobOfferList: any;
  isChangedBlock = -1;
  loading$: Observable<boolean> = of(false);
  paginator: any;
  selectedTenders: any[] = [];
  role_id: any;
  constructor(
    private route: ActivatedRoute,
    private store: Store<fromJob.State>,
    private dialog: MatDialog,
    private storageService: StorageService,
    private translateService: TranslateService,
    private toastrService: ToastrService,
    private router: Router  ) {
  }

  ngOnInit(): void {
    const abc = this.storageService.get('freelancerToDetail');
    this.Type = abc;
    const isMatched = this.storageService.get('freelancerIsMatched');
    this.route.paramMap.subscribe((params: ParamMap) => {
      // @ts-ignore
      this.paramId = +params.get('id');
      this.role_id = params.get('role_id');
    });
    // @ts-ignore
    this.store.select(fromCurrentUser.getCurrentUserInfo).subscribe((res: any) => {
      if (res) {
        this.freelancerId = res?.freelancer_id;
        this.store.dispatch(new fromJobAction.LoadFreelancerJobDetail({id: this.paramId, fid: this.freelancerId, role_id: this.role_id, is_matched: isMatched}));
        this.store.select(fromJob.getFreelancerJobOfferDetails).subscribe(
          (freelanceData: any) => {
            /*this.freelancerJobOfferList =  {
              title: freelanceData?.data?.title.split(' | ')[0],
              titleForQuestion: freelanceData?.data?.title,
              ContractType: freelanceData?.data?.contract_type_id === 1 ? 'Trade license' : 'Income Tax Card',
              Could: freelanceData?.data?.tenders?.data[0].snapshots?.client?.name,
              category: freelanceData?.data?.project?.data?.category,
              SubsidiaryCompany: freelanceData?.data?.tenders?.data[0].site,
              requiredCertificates: freelanceData?.data?.certificates,
              Description: freelanceData?.data?.description,
              GeneralBriefing: freelanceData?.data?.project?.data?.briefing,
              operationTraining: freelanceData?.data?.certificates,
              card: freelanceData?.data?.tenders.data?.map((result: any) => {
                return {
                  tenderId: result?.id,
                  Until: result?.invalid_at,
                  startTime: result?.snapshots?.assignment.start_time,
                  endTime: result?.snapshots?.assignment.finish_time,
                  daily_rate_max: result?.daily_rate_max,
                  registering: result?.snapshots?.incentive_model?.checkin,
                  SalesReport: result?.snapshots?.incentive_model?.sales_report,
                  documentation: result?.snapshots?.incentive_model?.picture_documentation,
                  wages: result?.snapshots?.assignment?.wage
                };
              }),
              TaskBasedCompensation: freelanceData?.data?.project?.data?.additional_costs.map((data: any) => {
                return{
                  name: data?.name,
                  value: data?.value
                };
              }),
              group: freelanceData?.data?.group,
              name: freelanceData?.data?.name,
              number: freelanceData?.data?.number,
              address: freelanceData?.data?.address,
              zip: freelanceData?.data?.zip,
              city: freelanceData?.data?.city
            };*/
            if(freelanceData.data) {
              this.freelancerJobOfferList = {...freelanceData.data};
              this.freelancerJobOfferList.card = freelanceData?.data && freelanceData?.data?.tenders.data?.map((result: any) => ({
                  tenderId: result?.id,
                  Until: result?.invalid_at,
                  startTime: moment(result?.shift_start_time,'HHmmss').format('HH:mm'),
                  endTime: moment(result?.shift_end_time,'HHmmss').format('HH:mm'),
                  daily_rate_max: result?.rate,
                  registering: result?.snapshots?.incentive_model?.checkin,
                  SalesReport: result?.snapshots?.incentive_model?.sales_report,
                  documentation: result?.snapshots?.incentive_model?.picture_documentation,
                  wages: result?.snapshots?.assignment?.wage,
                  shift_name: result?.shift_name,
                  rate_type: result?.rate_type || null,
                  currency: result?.snapshots?.project?.currency,
                }));
              this.freelancerJobOfferList.Description = freelanceData?.data?.job_info.data.description;
              this.freelancerJobOfferList.GeneralBriefing= freelanceData?.data?.job_info.data.project?.data?.briefing,
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
  sortOption(options: OptionVM[]) {
    return options.sort((a: OptionVM, b: OptionVM) =>
      a.text && b.text ? (a.text > b.text ? 1 : b.text > a.text ? -1 : 0) : 0
    );
  }

  publishOffer() {
    const dialogRef = this.dialog.open(ConfirmBoxComponent,{
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
          if (data)
          {
            if (this.Type === 'header-all') {
              this.toastrService.success(this.translateService.instant('notification.post.projects.success'));
              this.router.navigate(['jobs', 'freelancer', 'all']);
              this.storageService.clear('freelancerToDetail');
            }
            else if (this.Type === 'header-recommended') {
              this.toastrService.success(this.translateService.instant('notification.post.projects.success'));
              this.router.navigate(['jobs', 'freelancer', 'recommended']);
              this.storageService.clear('freelancerToDetail');
            }
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
            if (this.Type === 'header-all') {
              this.router.navigate(['jobs', 'freelancer', 'all']);
              this.storageService.clear('freelancerToDetail');
            }
            else if (this.Type === 'header-recommended') {
              this.router.navigate(['jobs', 'freelancer', 'recommended']);
              this.storageService.clear('freelancerToDetail');
            }
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
          if (this.Type === 'header-all') {
            this.router.navigate(['jobs', 'freelancer', 'all']);
            this.storageService.clear('freelancerToDetail');
          }
          else if (this.Type === 'header-recommended') {
            this.router.navigate(['jobs', 'freelancer', 'recommended']);
            this.storageService.clear('freelancerToDetail');
          }
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
