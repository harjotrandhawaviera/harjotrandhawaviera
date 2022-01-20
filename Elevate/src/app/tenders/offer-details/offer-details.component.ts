/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/naming-convention */

import * as fromCurrentUser from '../../root-state/user-state';
import * as fromTender from '../state';
import * as fromTenderAction from '../state/tender.actions';
import * as moment from 'moment';

import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { ConfirmBoxComponent } from '../../core/confirm-box/confirm-box.component';
import { MatDialog } from '@angular/material/dialog';
import { OptionVM } from '../../model/option.model';
import { StorageService } from '../../services/storage.service';
import { Store } from '@ngrx/store';
import { SurveyLinkConfirmationComponent } from '../../core/survey-link-confirmation/survey-link-confirmation.component';
import { TenderService } from '../../services/tender.service';
import { ToastrService } from 'ngx-toastr';
import {TranslateService} from '../../services/translate.service';

@Component({
  selector: 'app-offer-details',
  templateUrl: './offer-details.component.html',
  styleUrls: ['./offer-details.component.scss']
})
export class OfferDetailsComponent implements OnInit {
  paramId: any;
  freelancerOfferDetails: OptionVM | any;
  adminOfferDetails: OptionVM | any;
  adminFreelancerDetails: OptionVM | any;
  loggedRole: string | undefined = '';
  ShiftLK: OptionVM[] = [];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private storageService: StorageService,
    private tenderService: TenderService,
    private store: Store<fromTender.State>,
    private dialog: MatDialog,
    private translateService: TranslateService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      // @ts-ignore
      this.paramId = +params.get('id');
    });
    this.store.select(fromCurrentUser.getCurrentUserInfo).subscribe((res) => {
      if (res) {
        this.loggedRole = res?.role;
        if (this.loggedRole === 'freelancer') {
          this.store.dispatch(new fromTenderAction.LoadFreelancerOfferDetail({id: this.paramId}));
          this.store.select(fromTender.getFreelancerOfferDetail).subscribe(
            ( res: any ) => {
              if (res?.data?.data) {
                this.freelancerOfferDetails = {
                  id: res?.data?.data?.id,
                  deleted_at: moment(res?.data?.data?.deleted_at).format('MMM DD, YYYY'),
                  expired_at: moment(res?.data?.data?.expired_at).format('MMM DD, YYYY'),
                  fee: res?.data?.data?.tender?.data?.daily_rate_max,
                  title: res?.data?.data?.tender?.data?.snapshots?.job?.title,
                  subName: res?.data?.data?.tender?.data?.snapshots?.client?.name,
                  siteGroup: res?.data?.data?.tender?.data?.snapshots?.site?.group,
                  siteName: res?.data?.data?.tender?.data?.snapshots?.site?.name,
                  siteNumber: res?.data?.data?.tender?.data?.snapshots?.site?.number,
                  siteAddress: res?.data?.data?.tender?.data?.snapshots?.job?.job_location,
                  siteZip: res?.data?.data?.tender?.data?.snapshots?.site?.zip,
                  siteCity: res?.data?.data?.tender?.data?.snapshots?.site?.city,
                  siteDate: res?.data?.data?.tender?.data?.snapshots?.date?.appointed_at,
                  contractType: res?.data?.data?.tender?.data?.contract_type?.data?.name,
                  category: res?.data?.data?.tender?.data?.category,
                  start_time: res?.data?.data?.tender?.data?.shift_start_time.substr(0,5),
                  finish_time: res?.data?.data?.tender?.data?.shift_end_time.substr(0,5),
                  description: res?.data?.data?.tender?.data?.snapshots?.assignment?.description,
                  briefing: res?.data?.data?.tender?.data?.snapshots?.assignment?.briefing,
                  sales: res?.data?.data?.tender?.data?.snapshots?.assignment?.additional_costs,
                  checkin: res?.data?.data?.tender?.data?.snapshots?.incentive_model?.checkin,
                  sales_report: res?.data?.data?.tender?.data?.snapshots?.incentive_model?.sales_report,
                  picture_documentation: res?.data?.data?.tender?.data?.snapshots?.incentive_model?.picture_documentation,
                  rate_type: res?.data?.data?.tender?.data?.snapshots?.assignment?.rate_type,
                  rate: res?.data?.data?.tender?.data?.snapshots?.assignment?.rate,
                  checkin_location: res?.data?.data?.tender?.data?.snapshots?.assignment?.checkin_location,
                  role_name: res?.data?.data?.tender?.data?.role_name,
                  job_code: res?.data?.data?.tender?.data?.snapshots?.job?.job_code,
                  job_location: res?.data?.data?.tender?.data?.snapshots?.job?.job_location,
                  currency: res?.data?.data?.tender?.data?.snapshots?.project?.currency,
                };
              }
            }
          );
        }
        else if (this.loggedRole !== 'freelancer') {
          this.store.dispatch(new fromTenderAction.LoadFreelancerOfferDetail({id: this.paramId}));
          this.store.select(fromTender.getFreelancerOfferDetail).subscribe((details: any) => {
            if (details?.data?.data) {
              const detailing = details?.data?.data;
              this.adminOfferDetails = {
                title: detailing?.tender?.data?.snapshots?.job?.title,
                freelancerName: detailing?.freelancer_fullname,
                could: detailing?.tender?.data?.snapshots?.client?.name,
                possible_fee: detailing?.tender?.data?.daily_rate_max,
                invalid_at: detailing?.tender?.data?.invalid_at,
                projectName: detailing?.tender?.data?.snapshots?.project?.name,
                wages: detailing?.tender?.data?.snapshots?.assignment?.wage,
                jobName: detailing?.tender?.data?.snapshots?.job?.title,
                siteGroup: detailing?.tender?.data?.snapshots?.site?.group,
                siteName: detailing?.tender?.data?.snapshots?.site?.name,
                contractType: detailing?.tender?.data?.contract_type?.data?.name,
                siteAddress: detailing?.tender?.data?.snapshots?.site?.address,
                siteNumber: detailing?.tender?.data?.snapshots?.site?.number,
                siteZip: detailing?.tender?.data?.snapshots?.site?.zip,
                siteCity: detailing?.tender?.data?.snapshots?.site?.city,
                catType: detailing?.tender?.data?.contract_type_id,
                category: detailing?.tender?.data?.category,
                description: detailing?.tender?.data?.snapshots?.project?.description,
                breifing: detailing?.tender?.data?.snapshots?.project?.briefing,
                freelancerId: detailing?.freelancer_id,
                tender_id: detailing?.tender_id,
                id: detailing?.id,
                assignment_id: detailing?.tender?.data?.assignment_id,
                expired_at: detailing?.expired_at,
                compensation: detailing?.tender?.data?.snapshots?.assignment?.additional_costs.map((a: any) => ({
                    name: a?.name,
                    value: a?.value
                  })),
                checkin: detailing?.tender?.data?.snapshots?.incentive_model?.checkin,
                sales_report: detailing?.tender?.data?.snapshots?.incentive_model?.sales_report,
                picture_documentation: detailing?.tender?.data?.snapshots?.incentive_model?.picture_documentation,
                role_name: detailing?.tender?.data?.role_name,
                shift_name: detailing?.tender?.data?.shift_name,
                appointed_at: moment.utc(detailing?.tender?.data?.snapshots?.date?.appointed_at).format('MMM DD, YYYY'),
                shift_start_time : detailing?.tender?.data?.shift_start_time.substr(0,5),
                shift_end_time : detailing?.tender?.data?.shift_end_time.substr(0,5),
                rate_type: detailing?.tender?.data?.snapshots?.assignment?.rate_type,
                rate: detailing?.tender?.data?.snapshots?.assignment?.rate,
                checkin_location: detailing?.tender?.data?.snapshots?.assignment?.checkin_location,
                job_code: detailing?.tender?.data?.snapshots?.job?.job_code,
                job_location: detailing?.tender?.data?.snapshots?.job?.job_location,
                currency: detailing?.tender?.data?.snapshots?.project?.currency,
              };
              this.store.dispatch(new fromTenderAction.LoadAdminFreelancer({fid: this.adminOfferDetails?.freelancerId}));
            }
          });
          this.store.select(fromTender.getAdminFreelancerDetail).subscribe((lists: any) => {
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

          // // tslint:disable-next-line:no-shadowed-variable
          // this.tenderService.getShiftLK().subscribe((res) => {
          //   this.ShiftLK = this.sortOption(
          //     res.data
          //       ? res.data.map((a: any) => {
          //         return {
          //           value: a?.data?.data?.id,
          //           text: [a.data?.data?.shift_name, a.data?.data?.shift_start_time, a.data?.data?.shift_end_time].join(' '),
          //
          //         };
          //       })
          //       : []
          //   );
          // });
        }
      }
    });
  }
  sortOption(options: OptionVM[]) {
    return options.sort((a: OptionVM, b: OptionVM) =>
      a.text && b.text ? (a.text > b.text ? 1 : b.text > a.text ? -1 : 0) : 0
    );
  }

  shortlistOffer(freelancerId: number, offerId: number, tenderId: number) {
    const data: any = [{ freelancer_id: freelancerId, offer_id: offerId, tender_id: tenderId }];
    this.store.dispatch(new fromTenderAction.CreateShortlist(data));
    this.toastrService.success(this.translateService.instant('notification.post.submitted-jobs.success'));
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
          this.store.dispatch(new fromTenderAction.LoadAdminOfferDetail(data));
        }
        else if (result.check === 'false'){
          const data: any = {
            fid,
            assignment_id: assignId,
            offer_id: tenderId
          };
          this.store.dispatch(new fromTenderAction.LoadAdminOfferDetail(data));
        }
        this.store.select(fromTender.getAdminOfferDetail).subscribe((success: any) => {
          if (success) {
            this.router.navigate(['/home/tenders/offers']);
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
        this.store.dispatch(new fromTenderAction.LoadAdminOfferRejectDetail({id}));
        this.router.navigate(['/home/tenders/offers']);
      }
    });
  }

}
