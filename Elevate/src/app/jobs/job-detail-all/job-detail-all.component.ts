import * as fromCurrentUser from '../../root-state/user-state';
import * as fromJob from '../state';
import * as fromJobAction from '../state/job.actions';

import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { JobFeedbackQuestionVM, JobSearchVM, JobVM } from '../../model/job.model';
import { Observable, of } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { take, takeWhile } from 'rxjs/operators';

import { BudgetVM } from '../../model/budget.model';
import { CertificateService } from '../../services/certificate.service';
import { ContractTypesService } from '../../services/contract-types.service';
import {DatePipe} from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { OptionVM } from '../../model/option.model';
import { SalesSlotVM } from '../../model/client.model';
import { StorageService } from '../../services/storage.service';
import { TranslateService } from '../../services/translate.service';

@Component({
  selector: 'app-job-detail-all',
  templateUrl: './job-detail-all.component.html',
  styleUrls: ['./job-detail-all.component.scss'],
})
export class JobDetailAllComponent implements OnInit {
  freelancerJob = new FormGroup({
    contractType: new FormControl(),
    start: new FormControl(),
    end: new FormControl(),
    certificate: new FormControl(),
    search: new FormControl(),
    zip_from: new FormControl(),
    zip_to: new FormControl()
  });
  componentActive = true;
  id?: string | null;
  mode?: string;
  loggedRole: string | undefined = '';
  freelancerId: string | undefined = '';
  searchModel$: Observable<JobSearchVM | undefined> = of({});
  searchModel: any = {};
  hasFilter = false;
  contractTypeLK: OptionVM[] = [];
  certificateLK: OptionVM[] = [];
  freelancerJobOfferList: any | any[] = [];
  jobDetail$: Observable<JobVM | undefined> = of(undefined);
  budgetDetail$: Observable<BudgetVM | undefined> = of(undefined);
  salesSlot$: Observable<SalesSlotVM[] | undefined> = of(undefined);
  feedback$: Observable<JobFeedbackQuestionVM[] | undefined> = of(undefined);
  budgetContactNames: string | undefined;
  noRecords$: Observable<boolean> = of(false);
  stateLK: OptionVM[] = [];
  totalRecord: any; currentPage: any; totalPage: any;
  viewing: string = 'Tile';
  displayedColumns = [
    "Client Name",
    "Job Name",
    "Category",
    "City",
    "Post Code",
    "Site Address",
    "Expiry Date",
    "action"
  ];
  // – Client, Job Name, Category, City, Post Code, Site Address, Expiry Date
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private store: Store<fromJob.State>,
    private translateService: TranslateService,
    private contractTypesService: ContractTypesService,
    private certificateService: CertificateService,
    private storageService: StorageService,
    private userStore: Store<fromCurrentUser.State>,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.store.select(fromCurrentUser.getCurrentUserInfo).subscribe((res: any) => {
      if (res) {
        this.loggedRole = res?.role;
        const freelancerId = res?.freelancer_id;
        this.freelancerId = res?.freelancer_id;
        if (this.loggedRole === 'freelancer') {
          this.getSelectedFilters();
          this.searchModel = { ...this.searchModel, freelancer_id: freelancerId, pageIndex: 1, is_not_matching: true };
          this.store.dispatch(new fromJobAction.LoadFreelancerJobOffer({ search: this.searchModel }));
          this.store.select(fromJob.getFreelancerJobOffer).subscribe(
            (freelanceData: any) => {
              this.totalRecord = freelanceData?.data?.meta?.pagination?.total;
              this.currentPage = freelanceData?.data?.meta?.pagination?.current_page;
              this.totalPage = freelanceData?.data?.meta?.count;
              if (freelanceData?.data?.data) {
                this.freelancerJobOfferList = this.sortOption(
                  freelanceData?.data?.data
                  ? freelanceData?.data?.data.map((result: any) => {
                    return {
                      id: result?.id,
                      title: result?.project?.data?.name,
                      addName: result?.site?.data?.name,
                      addZip: result?.site?.data?.zip,
                      addCity: result?.site?.data?.city,
                      category: result?.category,
                      date: result?.tenders?.data,
                      contractType: result?.contract_type_id === 1 ? 'Trade License' : 'Income Tax Card',
                      TDate: result?. tenders?.data[0].invalid_at,
                      location: result?.title.split('|'),
                      group: result?.site?.data?.group,
                      name: result?.site?.data?.name,
                      address: result?.site?.data?.address,
                      number: result?.site?.data?.number,
                      ContractType: result?.contract_type?.data?.identifier,
                      tender: result?.tenders
                    };
                    })
                    : []
                );
              }
            }
          );
          this.translateService.get('contracts').subscribe((p) => {
            this.contractTypesService.getContractTypes({}).subscribe((c) => {
              this.contractTypeLK = this.sortOption(
                c.data
                  ? c.data.map((a) => {
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
          this.certificateService.getCertificate({}).subscribe((results) => {
            this.certificateLK = this.sortOption(
              results.data
                ? results.data.map((a) => {
                  return {
                    value: a.id,
                    text: [a.identifier, a.teaser].join(' ')
                  };
                })
                : []
            );
          });
          this.freelancerJob.get('contractType')?.valueChanges.subscribe((res) => {
            this.searchModel = {...this.searchModel, pageIndex: 1, contractType: res};
            this.store.dispatch(new fromJobAction.LoadFreelancerJobOffer({ search: this.searchModel }));
          });
          this.freelancerJob.get('certificate')?.valueChanges.subscribe((r) => {
            this.searchModel = {...this.searchModel, pageIndex: 1, certificate: r};
            this.store.dispatch(new fromJobAction.LoadFreelancerJobOffer({ search: this.searchModel }));
          });
          this.freelancerJob.get('start')?.valueChanges.subscribe((data) => {
            this.searchModel = {...this.searchModel, pageIndex: 1, start: this.datePipe.transform(data, 'yyyy-MM-dd yy:hh:ss')};
            this.store.dispatch(new fromJobAction.LoadFreelancerJobOffer({ search: this.searchModel }));
          });
          this.freelancerJob.get('end')?.valueChanges.subscribe((outcome) => {
            this.searchModel = {...this.searchModel, pageIndex: 1, end: this.datePipe.transform(outcome, 'yyyy-MM-dd yy:hh:ss')};
            this.store.dispatch(new fromJobAction.LoadFreelancerJobOffer({ search: this.searchModel }));
          });
          this.translateService.get('tenders').subscribe(() => {
            this.stateLK = [{ text: this.translateService.instant('tenders.tenders.fields.matching.matched'), value: 'is_matching'},
              { text: this.translateService.instant('tenders.tenders.fields.matching.mismatched'), value: 'is_not_matching'}];
          });
          this.freelancerJob.get('zip_from')?.valueChanges.subscribe((p) => {
            if (p !== null && p.length > 1) {
              this.searchModel = {
                ...this.searchModel,
                pageIndex: 1,
                zip_from: p,
              };
              this.store.dispatch(new fromJobAction.LoadFreelancerJobOffer({ search: this.searchModel }));
            } else {
              this.searchModel = {
                ...this.searchModel,
                pageIndex: 1,
                zip_from: p,
              };
              this.store.dispatch(new fromJobAction.LoadFreelancerJobOffer({search: this.searchModel }));
            }
          });
          this.freelancerJob.get('zip_to')?.valueChanges.subscribe((pro) => {
            if (pro && pro.length > 1) {
              this.searchModel = {
                ...this.searchModel,
                pageIndex: 1,
                zip_to: pro,
              };
              this.store.dispatch(new fromJobAction.LoadFreelancerJobOffer({ search: this.searchModel }));
            } else {
              this.searchModel = {
                ...this.searchModel,
                pageIndex: 1,
                zip_to: pro,
              };
              this.store.dispatch(new fromJobAction.LoadFreelancerJobOffer({search: this.searchModel }));
            }
          });
          this.freelancerJob.get('search')?.valueChanges.subscribe((s) => {
            if (s && s.length > 2) {
              this.searchModel = {
                ...this.searchModel,
                pageIndex: 1,
                search: s,
              };
              this.store.dispatch(new fromJobAction.LoadFreelancerJobOffer({ search: this.searchModel }));
            } else {
              this.searchModel = {
                ...this.searchModel,
                pageIndex: 1,
                search: s,
              };
              this.store.dispatch(new fromJobAction.LoadFreelancerJobOffer({search: this.searchModel }));
            }
          });

        }
        else if (this.loggedRole !== 'freelancer') {
          this.retrieveIdFromParameters();
          this.jobDetail$ = this.store.pipe(
            select(fromJob.getJobDetail),
            takeWhile(() => this.componentActive)
          );
          this.budgetDetail$ = this.store.pipe(
            select(fromJob.getBudgetDetail),
            takeWhile(() => this.componentActive)
          );
          this.salesSlot$ = this.store.pipe(
            select(fromJob.getSaleSlots),
            takeWhile(() => this.componentActive)
          );
          this.feedback$ = this.store.pipe(
            select(fromJob.getFeedbackQuestions),
            takeWhile(() => this.componentActive)
          );
          this.jobDetail$.subscribe((res) => {
            if (res) {
              if (res.budget_id && res.project?.client_id) {
                this.store.dispatch(
                  new fromJobAction.LoadBudgetDetail(res.project.client_id)
                );
              }
            }
          });
          this.budgetDetail$.subscribe((res) => {
            if (res && res.data) {
              const contacts = res.data[0].contacts.data;
              if (contacts) {
                this.budgetContactNames = contacts?.map((c: any) => c.fullname).join(',');
              }
            }
          });
        }
      }
    });
    this.noRecords$ = this.store.pipe(
      select(fromJob.getNoRecords),
      takeWhile(() => this.componentActive)
    );
    this.searchModel$ = this.store.pipe(
      select(fromJob.getSearchModel),
      takeWhile(() => this.componentActive)
    );
  }

  sortOption(options: OptionVM[]) {
    return options.sort((a: OptionVM, b: OptionVM) =>
      a.text && b.text ? (a.text > b.text ? 1 : b.text > a.text ? -1 : 0) : 0
    );
  }

  getSelectedFilters() {
    const previous = this.storageService.get('job.search');
    if (previous !== null) {
      const { contractType, start, end, search, certificate, zip_from, zip_to } =
        JSON.parse(previous) as JobSearchVM;
      this.freelancerJob.patchValue({
        contractType,
        certificate,
        start,
        end,
        search,
        zip_from,
        zip_to
      });
    } else {
      const searchModel: JobSearchVM = {
        pageIndex: 1,
        pageSize: 12,
        sortBy: 'appointed_at',
      };
      this.store.dispatch(new fromJobAction.UpdateFreelancerJobSearch(searchModel));
    }
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
          new fromJobAction.LoadJobDetail({ id: this.id, mode: 'detail' })
        );
      }
    }
  }

  setid(id: any){
    this.id = id;
    this.NavigateTojobDetails();
  }

  navigateToCreateClientTender() {
    this.router.navigate([`/jobs/client/${this.id}/tenders/create`]);
  }

  NavigateTojobDetails() {
    this.router.navigate([`/jobs/freelancers/${this.id}`]);
  }

  pageChange(event: any) {}
}
