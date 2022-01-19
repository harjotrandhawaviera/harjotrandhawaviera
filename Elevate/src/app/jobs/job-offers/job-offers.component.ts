import * as fromJob from './../state';
import * as fromJobAction from './../state/job.actions';

import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { take, takeWhile } from 'rxjs/operators';

import { JobVM } from '../../model/job.model';
import { TenderVM } from '../../model/tender.model';
import {OptionVM} from '../../model/option.model';
import {SelectionModel} from '@angular/cdk/collections';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmBoxComponent} from '../../core/confirm-box/confirm-box.component';
import {TranslateService} from '../../services/translate.service';
import {ToastrService} from 'ngx-toastr';
import {SurveyLinkConfirmationComponent} from '../../core/survey-link-confirmation/survey-link-confirmation.component';

@Component({
  selector: 'app-job-offers',
  templateUrl: './job-offers.component.html',
  styleUrls: ['./job-offers.component.scss'],
})
export class JobOffersComponent implements OnInit {
  componentActive = true;
  id?: string | null;
  offers: OptionVM[] = [];
  selection = new SelectionModel<any>(true, []);
  public pending1: boolean[] = [];
  public pending2: boolean[] = [];
  statusCheck = false;
  jobDetail$: Observable<JobVM | undefined> = of(undefined);
  jobOffer$: Observable<TenderVM[] | undefined> = of(undefined);
  selectedOffers: any[] = [];
  allResponse: any;
  tendersByFreelancer: any = {};
  freelancers: any = {};
  tendersAccepted: any = {};
  t: any;
  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private translateService: TranslateService,
    private toastrService: ToastrService,
    private store: Store<fromJob.State>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.retrieveIdFromParameters();
    this.jobDetail$ = this.store.pipe(
      select(fromJob.getJobDetail),
      takeWhile(() => this.componentActive)
    );

    this.jobOffer$ = this.store.pipe(
      select(fromJob.getJobOffer),
      takeWhile(() => this.componentActive)
    );
    this.store.select(fromJob.getJobOffer).subscribe((res: any) => {
      if (res) {
        this.allResponse = res;
        this.allResponse.forEach((tender: any) => {
          tender.offers.forEach((offer: any) => {
            if (!this.tendersByFreelancer[offer.freelancer_id]) {
              this.tendersByFreelancer[offer.freelancer_id] = [];
            }
            this.tendersByFreelancer[offer.freelancer_id].push(tender?.id);
            this.freelancers[offer.freelancer_id] = {
              name: offer?.freelancer?.fullname,
              userId: offer.freelancer?.user?.id,
              role: tender.role_name};
          });
        });
      }
      this.offers = this.sortOption(
        res
          ? res.map((a: any) => {
            return {
              value: a?.invalid_at,
              text: a?.snapshots?.client?.name,
              date: a?.id,
              offers: a?.offers,
              freelancer_id: a?.offers[0]?.freelancer_id,
              assignment_id: a?.assignment_id,
              offer_id: a?.offers[0]?.id,
              start_endTime: a?.shift_start_time + ' - ' + a?.shift_end_time,
              id: a?.id
            };
          })
          : []
      );
    });

  }

  tenderAvailable() {
    return !!Object.keys(this.tendersByFreelancer).length;
  }

  retrieveIdFromParameters() {
    this.route.paramMap.pipe(take(1)).subscribe((params) => {
      this.loadDetail(params);
    });
  }

  nameTender(key?: any) {
    return this.freelancers[key.key]?.name + ' ( ' + this.freelancers[key.key]?.role + ' )';
  }

  idReturn(tKey?: any) {
    return this.freelancers[tKey?.key]?.userId;
  }

  loadDetail(params: ParamMap) {
    if (params && params.get('id')) {
      this.id = params.get('id');
      if (this.id) {
        this.store.dispatch(
          new fromJobAction.LoadJobDetail({ id: this.id, mode: 'detail' })
        );
        this.store.dispatch(
          new fromJobAction.LoadJobOffer({id: this.id, type: 'job-offer'})
        );
      }
    }
  }

  sortOption(options: OptionVM[]) {
    return options.sort((a: OptionVM, b: OptionVM) =>
      a.text && b.text ? (a.text > b.text ? 1 : b.text > a.text ? -1 : 0) : 0
    );
  }

  reset() {
    this.offers.forEach((offer, i) => {
      this.selectedOffers = [];
    });
    this.statusCheck = false;
    this.tendersAccepted = {};
  }

  acceptAllOffer(freelancerId?: any) {
    this.selectedOffers = [];
    this.allResponse.forEach((tender: any) => {
      if (this.isOffered(tender.id, freelancerId)) {
        this.tendersAccepted[tender.id] = freelancerId;
        this.selectedOffers = this.offers.filter((a: any) => a.offers.length > 0);
      }
    });
    this.statusCheck = true;
  }

  isAccepted(tenderId?: any, freelancerId?: any) {
    return this.tendersAccepted[tenderId] && this.tendersAccepted[tenderId] === freelancerId;
  }

  acceptOffer(tenderId?: any, freelancerId?: any,  i?: any) {
    if (this.tendersAccepted[tenderId] === freelancerId) {
      delete this.tendersAccepted[tenderId];
    }
    else {
      this.tendersAccepted[tenderId] = freelancerId;
      this.selectedOffers.push(this.offers[i]);
    }
    this.statusCheck = !!Object.keys(this.tendersAccepted).length;
  }

  isOffered(tenderId?: number, freelancerId?: any) {
    return this.tendersByFreelancer[freelancerId] && this.tendersByFreelancer[freelancerId].includes(tenderId);
  }

  submitOffers() {
    this.dialog.open(SurveyLinkConfirmationComponent, {
      data: {
        type: 'warning',
        title: this.translateService.instant(
          'jobs.freelancer.details.submit-offer.title'),
        checkIn: this.translateService.instant('jobs.freelancer.details.submit-offer.check_in'),
        checkOut: this.translateService.instant('jobs.freelancer.details.submit-offer.check_out'),
        checkInPlaceholder: this.translateService.instant('jobs.freelancer.details.submit-offer.placeholder.check_in'),
        checkOutPlaceholder: this.translateService.instant('jobs.freelancer.details.submit-offer.placeholder.check_out'),
        cancelCode: 'jobs.freelancer.details.submit-offer.button.abort' ,
        confirmCode: 'jobs.freelancer.details.submit-offer.button.accept',
        value: true
      },
    }).afterClosed().subscribe((result) => {
      if (result) {
        this.selectedOffers.forEach((api) => {
          if (api) {
            this.store.dispatch(new fromJobAction.JobSubmittedOffer(api));
            this.toastrService.success(
              this.translateService.instant('notification.post.freelancers.success')
            );
            this.router.navigate(['/jobs']);
          }
        });
      }
    });
  }
}
