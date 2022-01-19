import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import * as fromJob from '../state';
import * as fromJobAction from './../state/job.actions';
import {OptionVM} from '../../model/option.model';
import {ConfirmBoxComponent} from '../../core/confirm-box/confirm-box.component';
import {MatDialog} from '@angular/material/dialog';
import {TranslateService} from '../../services/translate.service';
import {SurveyLinkConfirmationComponent} from '../../core/survey-link-confirmation/survey-link-confirmation.component';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-shortlistoffer-details',
  templateUrl: './shortlistoffer-details.component.html',
  styleUrls: ['./shortlistoffer-details.component.scss']
})

export class ShortlistofferDetailsComponent implements OnInit {
  paramId: any;
  shortlistOfferDetails: OptionVM | any;
  adminFreelancerDetails: OptionVM | any;
  adminOfferDetails: OptionVM | any;
  constructor(
    private store: Store<fromJob.State>,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private  toastrService: ToastrService,
    private translateService: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      // @ts-ignore
      this.paramId = +params.get('id');
    });
    this.store.dispatch(new fromJobAction.LoadShortlistOfferDetails({ id: this.paramId }));
    this.store.select(fromJob.getShortlistOfferDetails).subscribe(
      (res: any) => {
        if (res?.data) {
          const detailing = res?.data;
          this.shortlistOfferDetails = {
            title: detailing?.tender?.data?.snapshots?.job?.title,
            contractType: detailing?.tender?.data?.contract_type?.data?.name,
            freelancerName: detailing?.freelancer_fullname,
            could: detailing?.tender?.data?.snapshots?.client?.name,
            possible_fee: detailing?.tender?.data?.daily_rate_max,
            projectName: detailing?.tender?.data?.snapshots?.project?.name,
            wages: detailing?.tender?.data?.snapshots?.assignment?.wage,
            jobName: detailing?.tender?.data?.snapshots?.job?.title,
            siteGroup: detailing?.tender?.data?.snapshots?.site?.group,
            siteName: detailing?.tender?.data?.snapshots?.site?.name,
            siteAddress: detailing?.tender?.data?.snapshots?.site?.address,
            siteNumber: detailing?.tender?.data?.snapshots?.site?.number,
            siteZip: detailing?.tender?.data?.snapshots?.site?.zip,
            siteCity: detailing?.tender?.data?.snapshots?.site?.city,
            catType: detailing?.tender?.data?.contract_type_id === 1 ? 'Trade license' : 'Income Tax Card',
            category: detailing?.tender?.data?.category,
            description: detailing?.tender?.data?.snapshots?.project?.description,
            breifing: detailing?.tender?.data?.snapshots?.project?.briefing,
            freelancerId: detailing?.freelancer_id,
            tender_id: detailing?.tender_id,
            offer_id: detailing?.offer_id,
            id: detailing?.id,
            assignment_id: detailing?.tender?.data?.assignment_id,
            expired_at: detailing?.expired_at,
            compensation: detailing?.tender?.data?.snapshots?.assignment?.additional_costs.map((a: any) => {
              return {
                name: a?.name,
                value: a?.value
              };
            }),
            checkin: detailing?.tender?.data?.snapshots?.incentive_model?.checkin,
            sales_report: detailing?.tender?.data?.snapshots?.incentive_model?.sales_report,
            picture_documentation: detailing?.tender?.data?.snapshots?.incentive_model?.picture_documentation,
            role_name: detailing?.tender?.data?.role_name,
            shift_name: detailing?.tender?.data?.shift_name,
            shift_start_time : detailing?.tender?.data?.shift_start_time.substr(0, 5),
            shift_end_time : detailing?.tender?.data?.shift_end_time.substr(0, 5),
            rate_type: detailing?.tender?.data?.snapshots?.assignment?.rate_type,
            rate: detailing?.tender?.data?.snapshots?.assignment?.rate,
            checkin_location: detailing?.tender?.data?.snapshots?.assignment?.checkin_location,
            job_code: detailing?.tender?.data?.snapshots?.job?.job_code,
            job_location: detailing?.tender?.data?.snapshots?.job?.job_location,
            currency: detailing?.tender?.data?.snapshots?.project?.currency,
          };
          this.store.dispatch(new fromJobAction.LoadAdminFreelancer({fid: this.shortlistOfferDetails?.freelancerId}));
        }
      }
    );
    this.store.select(fromJob.getAdminFreelancerDetail).subscribe((lists: any) => {
      if (lists?.data?.data) {
        const values = lists?.data?.data;
        this.adminFreelancerDetails = {
          id: values?.user?.data?.id,
          name: values?.fullname,
          mobile: values?.mobile,
          email: values?.user?.data?.email
        };
      }
    });
  }

  confirmOffer(fid: number, assignId: number, tenderId: number) {
    const dialogRef = this.dialog.open(SurveyLinkConfirmationComponent, {
      data: {
        type: 'warning',
        title: this.translateService.instant(
          'offers.buttons.confirmOffer'
        ),
        checkIn: this.translateService.instant('offers.confirm-offer.check_in'),
        checkOut: this.translateService.instant('offers.confirm-offer.check_out'),
        checkInPlaceholder: this.translateService.instant('offers.confirm-offer.placeholder.check_in'),
        checkOutPlaceholder: this.translateService.instant('offers.confirm-offer.placeholder.check_out'),
        cancelCode: 'offers.buttons.abort' ,
        confirmCode: 'offers.buttons.accept',
        value: true
      },
    }).afterClosed().subscribe((result) => {
      if (result) {
        if (result.check === 'true') {
          const data: any = {
            fid,
            assignment_id: assignId,
            offer_id: tenderId,
            checkin_survey: result.checkInSurvey,
            checkout_survey: result.checkOutSurvey
          };
          this.store.dispatch(new fromJobAction.LoadAdminOfferDetail(data));
        }
        else if (result.check === 'false'){
          const data: any = {
            fid,
            assignment_id: assignId,
            offer_id: tenderId
          };
          this.store.dispatch(new fromJobAction.LoadAdminOfferDetail(data));
        }
        this.store.select(fromJob.getAdminOfferDetail).subscribe((success: any) => {
          if (success) {
            this.router.navigate(['jobs/shortlist']);
            this.toastrService.success(this.translateService.instant('notification.post.survey-message.success'));
          }
        });
      }
    });
  }

  rejectedOffers(id: number) {
    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      data: {
        type: 'warning',
        title: this.translateService.instant(
          'offers.buttons.rejectOffer'
        ),
        message: this.translateService.instant(
          'offers.dialog.messageReject'
        ),
        cancelCode: 'offers.buttons.abort' ,
        confirmCode: 'offers.buttons.accept',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(new fromJobAction.LoadAdminOfferRejectDetail({id}));
        this.router.navigate(['jobs/shortlist']);
      }
    });
  }
}
