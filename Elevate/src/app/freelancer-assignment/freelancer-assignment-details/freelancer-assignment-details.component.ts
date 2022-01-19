import { Component, OnInit } from '@angular/core';
import { FreelancerAssignmentFacade } from '../+state/freelancer-assignment.facade';
import { TranslateService } from '../../services/translate.service';
import { OptionVM } from '../../model/option.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import * as fromCurrentUser from '../../root-state/user-state';
import { Store } from '@ngrx/store';
import { PreviewDownloadPopupComponent } from '../../admin-freelancer/preview-download-popup/preview-download-popup.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-freelancer-assignment-details',
  templateUrl: './freelancer-assignment-details.component.html',
  styleUrls: ['./freelancer-assignment-details.component.scss']
})
export class FreelancerAssignmentDetailsComponent implements OnInit {
  FreelancerAssignmentDetails: OptionVM | any;
  paramId: any;

  constructor(private FreelancerAccountingFacade: FreelancerAssignmentFacade,
              private translateService: TranslateService,
              private dialog: MatDialog,
              private route: ActivatedRoute, private store: Store) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      // @ts-ignore
      this.paramId = +params.get('id');
    });
    let userRoleId;
    this.store.select(fromCurrentUser.getCurrentUserInfo).subscribe((res) => {
      userRoleId = res?.role_id;
      if (userRoleId) {
        // @ts-ignore
        this.FreelancerAccountingFacade.FreelancerAssignmentDetail(userRoleId, this.paramId);
      }
    });
    this.translateService.get('contracts').subscribe(() => {
      this.translateService.get('certificates').subscribe(() => {
        this.FreelancerAccountingFacade.getFreelancerAssignmentDetails$.subscribe((res: any) => {
          if (res?.data) {
            this.FreelancerAssignmentDetails = {
              id: res?.data?.id,
              identifier: this.translateService.instant('contracts.identifier.' + res?.data?.contract_type?.identifier),
              category: this.translateService.instant('projects.fields.category.' + res?.data?.category),
              invalid_at: res?.data?.offer?.data?.tender?.data?.invalid_at,
              client: res?.data?.date?.data?.job?.data?.project?.data?.client?.data?.name,
              start_time: res?.data?.start_time,
              finish_time: res?.data?.finish_time,
              group: res?.data?.date?.data?.job?.data?.site?.data?.group,
              daily_rate_max: res?.data?.offer?.data?.tender?.data?.daily_rate_max,
              address: res?.data?.date?.data?.job?.data?.site?.data?.name,
              sub_address: res?.data?.date?.data?.job?.data?.site?.data?.address,
              zip: res?.data?.date?.data?.job?.data?.site?.data?.zip,
              fullName: res?.data?.agent?.fullname,
              email: res?.data?.agent?.email,
              city: res?.data?.date?.data?.job?.data?.site?.data?.city,
              number: res?.data?.date?.data?.job?.data?.site?.data?.number,
              subName: res?.data?.date?.data?.job?.data?.project?.data?.name,
              description: res?.data?.description,
              title: res?.data?.date?.data?.job?.data?.title,
              job_location: res?.data?.date?.data?.job?.data?.job_location,
              briefing: res?.data?.briefing,
              contract_type: res?.data?.contract_type?.name,
              rate: res?.data?.rate,
              staff: res?.data?.staff,
              checkin_location: res?.data?.checkin_location,
              rate_type: res?.data?.rate_type,
              role_name: res?.data?.role_name,
              currency: res?.data?.date?.data?.job?.data?.project?.data?.currency,
              job_number: res?.data?.date?.data?.job?.data?.job_code,
              job_overview: res?.data?.date?.data?.job?.data?.job_overview,
              taskinfo: res?.data?.date?.data?.job?.data?.taskinfo,
              feedback: res?.data?.feedback.map((a: any) => {
                return {
                  question: a?.question
                };
              }),
              documents: res?.data?.documents,
              additional_costs: res?.data?.additional_costs.map((a: any) => {
                return {
                  name: a?.name,
                  value: a?.value
                };
              }),
              checkin: res?.data?.incentive_model?.checkin,
              sales_report: res?.data?.incentive_model?.sales_report,
              picture_documentation: res?.data?.incentive_model?.picture_documentation
            };
          }
        });
      });
    });
  }
  sortOption(options: OptionVM[]) {
    return options.sort((a: OptionVM, b: OptionVM) =>
      a.text && b.text ? (a.text > b.text ? 1 : b.text > a.text ? -1 : 0) : 0
    );
  }
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
}
