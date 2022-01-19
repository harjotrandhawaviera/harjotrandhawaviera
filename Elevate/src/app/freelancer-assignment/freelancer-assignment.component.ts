import { Component, OnInit } from '@angular/core';
import { OptionVM } from '../model/option.model';
import { FreelancerAssignmentFacade } from './+state/freelancer-assignment.facade';
import { FormControl, FormGroup } from '@angular/forms';
import { ContractTypesService } from '../services/contract-types.service';
import { TranslateService } from '../services/translate.service';
import { FormConfig } from '../constant/forms.constant';
import { AccountingSearchVM } from '../model/accounting.model';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import {select, Store} from "@ngrx/store";
import * as fromUser from "../root-state/user-state";
import * as fromProfileAction from "../profile/state/profile.actions";
import * as fromProfile from "../profile/state";

@Component({
  selector: 'app-freelancer-assignment',
  templateUrl: './freelancer-assignment.component.html',
  styleUrls: ['./freelancer-assignment.component.scss']
})
export class FreelancerAssignmentComponent implements OnInit {
  searchValue = new FormGroup({
    upcoming: new FormControl('upcoming'),
    contactType: new FormControl(),
    start: new FormControl(),
    end: new FormControl(),
    status: new FormControl(),
    invoice: new FormControl(),
    search: new FormControl(),
  });
  searchModel: AccountingSearchVM = {};
  callList: OptionVM | any;
  contractTypeLK: OptionVM[] = [];
  stateLK: OptionVM[] = [];
  hasFilter = false;
  noRecords = false;
  isChangedBlock = -1;
  paginator: any;
  id: number | undefined;


  constructor(private freelancerAssignmentFacade: FreelancerAssignmentFacade,
              private contractTypesService: ContractTypesService,
              private translateService: TranslateService,
              private router: Router,
              private userStore: Store<fromUser.State>,
              private store: Store<fromProfile.State>,
              private datePipe: DatePipe) {
  }

  ngOnInit(): void {
    this.freelancerAssignmentFacade.FreelancerAssignmentCallList();
    this.translateService.get('contracts').subscribe(() => {
      this.translateService.get('projects').subscribe(() => {
        this.freelancerAssignmentFacade.getFreelancerAssignment$.subscribe((lists: any) => {
          this.callList = this.sortOption(
            lists.data
              ? lists.data.map((a: any) => {
                return {
                  id: a?.id,
                  identifier: a?.contract_type?.identifier && this.translateService.instant('contracts.identifier.' + a?.contract_type?.identifier),
                  category: this.translateService.instant('projects.fields.category.' + a?.category),
                  name: a?.date?.data?.job?.data?.title,
                  date: a?.date?.data.appointed_at,
                  client: a?.date?.data?.job?.data?.project?.data?.client?.data?.name,
                  start_time: a?.start_time,
                  finish_time: a?.finish_time,
                  group: a?.date?.data?.job?.data?.job_location,
                  address: a?.date?.data?.job?.data?.job_location,
                  sub_address:  a?.date?.data?.job?.data?.site?.data?.address,
                  zip: a?.date?.data?.job?.data?.site?.data?.zip,
                  city: a?.date?.data?.job?.data?.site?.data?.city,
                  state: a?.state,
                  rate: a?.rate,
                  staff: a?.staff?.fullname,
                  checkin_location: a?.checkin_location,
                  rate_type: a?.rate_type,
                  currency: a?.date?.data?.job?.data?.project?.data?.currency,
                  invoice: a?.invoices?.data.map((r: any) => {
                    return {
                      payment_total: r?.payment_total,
                      number: r?.number
                    };
                  }),
                  document: a?.documents?.data.map((d: any) => {
                    return {
                      original_filename: d?.original_filename,
                    };
                  }),
                  total: a?.revenues?.data.map((data: any) => {
                    return{
                      total: data?.total
                    };
                  }),
                };
              })
              : []
          );
          this.paginator = lists?.meta?.pagination;
        });
      });
    });

    this.searchValue.get('upcoming')?.valueChanges.subscribe((res) => {
      // @ts-ignore
      this.searchModel = {...this.searchModel, pageIndex: 1, upcoming: res};
      this.freelancerAssignmentFacade.loadUpdateFreelancerAssignmentSearchList(this.searchModel);
    });
    this.searchValue.get('contactType')?.valueChanges.subscribe((res) => {
      // @ts-ignore
      this.searchModel = {...this.searchModel, pageIndex: 1, contactType: res};
      this.freelancerAssignmentFacade.loadUpdateFreelancerAssignmentSearchList(this.searchModel);
    });
    this.searchValue.get('start')?.valueChanges.subscribe((res) => {
      const date = this.datePipe.transform(res, 'yyyy-MM-dd yy:hh:ss');
      // @ts-ignore
      this.searchModel = {...this.searchModel, pageIndex: 1, start: date};
      this.freelancerAssignmentFacade.loadUpdateFreelancerAssignmentSearchList(this.searchModel);
    });
    this.searchValue.get('end')?.valueChanges.subscribe((res) => {
      const date = this.datePipe.transform(res, 'yyyy-MM-dd yy:hh:ss');
      // @ts-ignore
      this.searchModel = {...this.searchModel, pageIndex: 1, end: date};
      this.freelancerAssignmentFacade.loadUpdateFreelancerAssignmentSearchList(this.searchModel);
    });
    this.searchValue.get('status')?.valueChanges.subscribe((res) => {
      if (res) {
        // @ts-ignore
        this.searchModel = {...this.searchModel, pageIndex: 1, status: res};
        this.freelancerAssignmentFacade.loadUpdateFreelancerAssignmentSearchList(this.searchModel);
      }
      if (!res) {
        // @ts-ignore
        this.searchModel = {...this.searchModel, pageIndex: 1, status: res };
        this.freelancerAssignmentFacade.loadUpdateFreelancerAssignmentSearchList(this.searchModel);
      }
    });
    this.searchValue.get('invoice')?.valueChanges.subscribe((res) => {
      if (res) {
        // @ts-ignore
        this.searchModel = {...this.searchModel, pageIndex: 1, invoice: res};
        this.freelancerAssignmentFacade.loadUpdateFreelancerAssignmentSearchList(this.searchModel);
      }
    });
    this.searchValue.get('search')?.valueChanges.subscribe((res) => {
      if ((res && res.length > 2) || !res) {
        this.searchModel = {...this.searchModel, pageIndex: 1, search: res};
        this.freelancerAssignmentFacade.loadUpdateFreelancerAssignmentSearchList(this.searchModel);
      }
    });

    this.translateService.get('contracts').subscribe((p) => {
      this.contractTypesService.getContractTypeLK().subscribe((res) => {
        this.contractTypeLK = this.sortOption(
          res.data
            ? res.data.map((a) => {
              return {
                value: a.id,
                text: this.translateService.instant(
                  'contracts.identifier.' + a.identifier
                ),
              };
            })
            : []
        );
      });
    });

    this.translateService.get('invoices.fields.states').subscribe(res => {
      this.stateLK = FormConfig.invoices.states.map(a => {
        return {
          text: res[a],
          value: a
        };
      });
    });
  }

  sortOption(options: OptionVM[]) {
    return options.sort((a: OptionVM, b: OptionVM) =>
      a.text && b.text ? (a.text > b.text ? 1 : b.text > a.text ? -1 : 0) : 0
    );
  }

  navigateToDetails(row: any) {
   this.router.navigate(['my', 'assignments', row.id]);
  }

  pageChange(event: any) {
    const update = {
      ...this.searchModel,
      pageSize: event.pageSize,
      pageIndex: event.pageIndex + 1,
    };
    this.freelancerAssignmentFacade.loadUpdateFreelancerAssignmentSearchList(update);
  }

}
