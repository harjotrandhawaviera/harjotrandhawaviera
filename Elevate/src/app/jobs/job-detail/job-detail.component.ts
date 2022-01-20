/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/naming-convention */

import * as fromCurrentUser from './../../root-state/user-state';
import * as fromJob from './../state';
import * as fromJobAction from './../state/job.actions';
import * as moment from 'moment';

import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {JobAdvertiseSearchVM, JobFeedbackQuestionVM, JobSearchVM, JobVM} from '../../model/job.model';
import { Observable, of } from 'rxjs';
import { SalesSlotVM, TaskInfoVM, TeamInfoVM } from '../../model/client.model';
import { Store, select } from '@ngrx/store';
import { take, takeWhile } from 'rxjs/operators';

import {AgentService} from '../../services/agent.service';
import { AppService } from 'src/controller/app.service';
import { BudgetVM } from '../../model/budget.model';
import { CertificateService } from '../../services/certificate.service';
import {ClientService} from '../../services/client.service';
import { ContractTypesService } from '../../services/contract-types.service';
import {DatePipe} from '@angular/common';
import {FilterService} from '../../services/filter.service';
import {FormConfig} from '../../constant/forms.constant';
import {JobService} from '../../services/job.service';
import { MatDialog } from '@angular/material/dialog';
import { OptionVM } from '../../model/option.model';
import {ProjectService} from '../../services/project.service';
import {SelectionModel} from '@angular/cdk/collections';
import {SkillService} from '../../services/skill.service';
import { StorageService } from '../../services/storage.service';
import {TenderService} from '../../services/tender.service';
import { TranslateService } from '../../services/translate.service';

@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.scss'],
})
export class JobDetailComponent implements OnInit {
  freelancerJob = new FormGroup({
    contractType: new FormControl(),
    start: new FormControl(),
    end: new FormControl(),
    certificate: new FormControl(),
    search: new FormControl(),
    zip_from: new FormControl(),
    zip_to: new FormControl()
  });
  inviteJob = new FormGroup({
    client: new FormControl(''),
    city: new FormControl(''),
    postcode: new FormControl(''),
    gender: new FormControl(''),
    age_group: new FormControl(''),
    skill: new FormControl(''),
    certificates: new FormControl(''),
    language: new FormControl(''),
    status: new FormControl(''),
    project: new FormControl(''),
    agent: new FormControl(''),
    state: new FormControl(''),
    contractType: new FormControl(''),
    job: new FormControl(''),
    jobName: new FormControl(''),
    publishJob: new FormControl(''),
    dateFrom: new FormControl(''),
    dateTo: new FormControl(''),
    zipFrom: new FormControl(''),
    zipTo: new FormControl(''),
    search: new FormControl(''),
    inviteContractType: new FormControl(''),
    inviteStart: new FormControl(''),
    inviteEnd: new FormControl(''),
    inviteZip_from: new FormControl(''),
    inviteZip_to: new FormControl(''),
    inviteCertificate: new FormControl('')
  });
  emitFilter = new EventEmitter();
  pageSize = new FormControl();
  componentActive = true;
  id?: string | null;
  mode?: string;
  loggedRole: string | undefined = '';
  freelancerId: string | undefined = '';
  searchModel$: Observable<JobSearchVM | undefined> = of({});
  searchModelAdmin$: Observable<JobAdvertiseSearchVM | undefined> = of({});
  searchModel: any = {};
  hasFilter = false;
  contractTypeLK: OptionVM[] = [];
  agentLK: OptionVM[] = [];
  clientList: OptionVM[] = [];
  projectLK: OptionVM[] = [];
  pageLK: OptionVM | any;
  jobLK: OptionVM[] = [];
  jobAdvertise: OptionVM[] = [];
  postcodeLK: OptionVM | any;
  ageLK: OptionVM | any;
  cityLK: OptionVM | any;
  userList: OptionVM | any = [];
  genderLK: OptionVM[] = [];
  certificatesLK: OptionVM[] = [];
  languageLK: OptionVM[] = [];
  skillsLk: OptionVM[] = [];
  certificateLK: OptionVM[] = [];
  inviteList: OptionVM | any = [];
  freelancerJobOfferList: any | any[] = [];
  selection = new SelectionModel<any>(true, []);
  jobDetail$: Observable<JobVM | undefined> = of(undefined);
  budgetDetail$: Observable<BudgetVM | undefined> = of(undefined);
  salesSlot$: Observable<SalesSlotVM[] | undefined> = of(undefined);
  feedback$: Observable<JobFeedbackQuestionVM[] | undefined> = of(undefined);

  teamInfo$: Observable<TeamInfoVM[] | undefined> = of(undefined);
  taskInfo$: Observable<TaskInfoVM[] | undefined> = of(undefined);
  budgetContactNames: string | undefined;
  certificates: any;
  noRecords$: Observable<boolean> = of(false);
  stateLK: OptionVM[] = [];
  totalRecord: any; currentPage: any; totalPage: any;
  viewing = 'Tile';
  setPageTitle = 'header-all';
  show = false;
  pagination: any;
  selectedValue: any;
  displayedColumns = [
    'select',
    'name',
    'gender',
    'age',
    'mobile',
    'email',
    'city',
    'postcode',
    'date',
    'status',
    'action'
  ];
  freelancerJobsColumns = [
    'Name',
    'Role',
    'POS',
    'City',
    'Street and House Number',
    'Postal Code',
    'action'
  ];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private store: Store<fromJob.State>,
    private translateService: TranslateService,
    private contractTypesService: ContractTypesService,
    private certificateService: CertificateService,
    private storageService: StorageService,
    private jobService: JobService,
    private projectService: ProjectService,
    private agentService: AgentService,
    private filterService: FilterService,
    private skillService: SkillService,
    private tenderService: TenderService,
    private clientService: ClientService,
    private userStore: Store<fromCurrentUser.State>,
    private datePipe: DatePipe,
    public app: AppService
  ) {}

  ngOnInit(): void {
    this.store.select(fromCurrentUser.getCurrentUserInfo).subscribe((res: any) => {
      if (res) {
        this.loggedRole = res?.role;
        const freelancerId = res?.freelancer_id;
        this.freelancerId = res?.freelancer_id;
        if (this.loggedRole === 'freelancer') {
          this.getSelectedFilters();
          this.searchModel = { ...this.searchModel, freelancer_id: freelancerId, pageIndex: 1 };
          this.searchModel.is_invited = false;
          this.searchModel.only_recommended = false;
          if(this.route.snapshot.url[0].path === 'freelancer' && this.route.snapshot.url[1].path === 'recommended') {
            this.searchModel.only_recommended = true;
            this.setPageTitle = 'header-recommended';
            this.searchModel.is_match = true;
            this.show =true;
          } else if(this.route.snapshot.url[0].path === 'freelancer' && this.route.snapshot.url[1].path === 'invite') {
            this.searchModel.is_invited = true;
            this.setPageTitle = 'header-invited';
            this.show = false;
          } else {
            this.searchModel.only_recommended = false;
            this.setPageTitle = 'header-all';
            this.show = true;
          }
          if (this.show === false) {
            this.store.dispatch(new fromJobAction.LoadJobInvite(this.searchModel));
            this.store.select(fromJob.getJobInvite).subscribe((res: any) => {
              this.inviteList = this.sortOption(
                res?.data
                ? res?.data.map((a: any) => ({
                      id: a?.id,
                      role_name: a?.role_name,
                      job_advert_start_date: a?.job_advert_start_date,
                      days: a?.days,
                      contract_type: a?.contract_type,
                      job_location: a?.job_location,
                      staff_manager: a?.staff_manager,
                      client_name: a?.client_name,
                      job_name: a?.job_name,
                      job_advert_end_date: a?.job_advert_start_date,
                      job_advert_end_date_time: a?.job_advert_end_date_time
                    }))
                  : []
              );
              this.pagination = res?.meta?.pagination;
            });
            this.inviteJob.get('inviteContractType')?.valueChanges.subscribe((res) => {
              this.searchModel = {...this.searchModel, pageIndex: 1, contractType: res};
              this.store.dispatch(new fromJobAction.LoadJobInvite({ search: this.searchModel }));
            });
            this.inviteJob.get('inviteStart')?.valueChanges.subscribe((res) => {
              this.searchModel = { ...this.searchModel, pageIndex: 1, zip_from: res };
              this.store.dispatch(new fromJobAction.LoadJobInvite(this.searchModel));
            });
          }
          this.store.dispatch(new fromJobAction.LoadFreelancerJobOffer({ search: this.searchModel }));
          this.store.select(fromJob.getFreelancerJobOffer).subscribe(
            (freelanceData: any) => {
              this.totalRecord = freelanceData?.data?.meta?.pagination?.total;
              this.currentPage = freelanceData?.data?.meta?.pagination?.current_page;
              this.totalPage = freelanceData?.data?.meta?.pagination?.per_page;
              if (freelanceData?.data?.data) {
                this.freelancerJobOfferList = freelanceData?.data?.data;
              }
            }
          );
          this.translateService.get('contracts').subscribe((p) => {
            this.contractTypesService.getContractTypes({}).subscribe((c) => {
              this.contractTypeLK = this.sortOption(
                c.data
                  ? c.data.map((a) => ({
                      value: a.id,
                      text: this.translateService.instant(
                        'contracts.identifier.' + a.identifier
                      ),
                    }))
                  : []
              );
            });
          });
          this.certificateService.getCertificate({}).subscribe((results) => {
            this.certificateLK = this.sortOption(
              results.data
                ? results.data.map((a) => ({
                    value: a.id,
                    text: [a.identifier, a.teaser].join(' ')
                  }))
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
            if (s && s.length > 2 || !s) {
              this.searchModel = {
                ...this.searchModel,
                pageIndex: 1,
                search: s,
              };
              this.store.dispatch(new fromJobAction.LoadFreelancerJobOffer({ search: this.searchModel }));
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
          this.teamInfo$ = this.store.pipe(
            select(fromJob.getTeamInfo),
            takeWhile(() => this.componentActive)
          );
          this.taskInfo$ = this.store.pipe(
            select(fromJob.getTaskInfo),
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

  setid(freelanceData: any){
    this.id = freelanceData.id;
    this.NavigateTojobDetails(freelanceData);
  }

  navigateToCreateClientTender() {
    this.router.navigate([`/home/jobs/client/${this.id}/tenders/create`]);
  }

  NavigateTojobDetails(freelanceData: any) {
    const data = this.setPageTitle;
    this.router.navigate([`/home/jobs/adv/${freelanceData.job_advertisement_id}/role/${freelanceData.staff_role_id}`]);
    this.storageService.set('freelancerToDetail', data);
    this.storageService.set('freelancerIsMatched', freelanceData.is_matched);
  }
  loadClientList() {
    this.clientService
      .getClients({
        limit: 1000000,
        order_by: 'name',
        order_dir: 'asc',
        only_fields: ['client.id', 'client.name'],
      })
      .subscribe((res) => {
        this.clientList = res.data
          ? res.data.map((a) => ({
              value: a.id,
              text: a.name,
            }))
          : [];
      });
  }

  loadProjectList(id?: number) {
    // console.log(id)
    // this.inviteJob.get('project')?.patchValue('');
    // this.jobService
    //   .getJobsByClientId({
    //     limit: 1000000,
    //   }, id).subscribe((res) => {
    //   this.jobLK = res.data
    //     ? res.data.map((a) => {
    //       return {
    //         value: a.id,
    //         text: a.title,
    //       };
    //     })
    //     : [];
    // });
  }

  loadJobList(id?: number) {
    this.inviteJob.get('job')?.patchValue('');
    this.jobService
      .getJobsByClientId({
        limit: 1000000,
        order_by: 'title',
        order_dir: 'asc',
        only_fields: ['job.id', 'job.title'],
        filters: []
      }, id)
      .subscribe((res) => {
        this.jobLK = res.data
          ? res.data.map((a) => ({
              value: a.id,
              text: a.title,
            }))
          : [];
      });
  }

  loadPublishJobList(id?: number) {
    this.inviteJob.get('publishJob')?.patchValue('');
    this.jobService
      .getJobAdvertisementById({}, id).subscribe((res: any) => {
      this.jobAdvertise = res.data
        ? res.data.map((a: any) => ({
            value: a?.job_advertisement_id,
            text: a?.role_name + ' | ' + a?.job_advert_start_date + ' to ' + a?.job_advert_end_date,
            staff_role_id: a?.staff_role_id,
            job_id: a?.job_id
          }))
        : [];
    });
  }

  selectionValue(value: any) {
    this.selectedValue = value;
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.ageLK;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.userList.forEach((row: { id: any }) => this.selection.select(row.id));
  }

  submit() {
    this.store.dispatch(new fromJobAction.LoadUserList(this.searchModel));
  }

  sendInvite() {
    const values = {
      staff_role_id: this.selectedValue.staff_role_id,
      freelancer_ids: this.selection.selected.map((d) => d.id),
      job_id: this.selectedValue.job_id,
      job_advertisement_id: this.selectedValue.value,
    };
    this.store.dispatch(new fromJobAction.SendInvite(values));
  }

  pageChange(event: any) {
    const pageIndex = event.pageIndex + 1;
    this.searchModel = { ...this.searchModel, page: pageIndex, limit: this.pageSize.value };
    this.store.dispatch(new fromJobAction.LoadUserList(this.searchModel));
  }

  pageChangeFreelancer(event: any) {
    const pageIndex = event.pageIndex + 1;
   // ? this.searchModel = {...this.searchModel, page: pageIndex, limit: event.pageSize};
    this.searchModel = {...this.searchModel,  page: pageIndex};
    this.store.dispatch(new fromJobAction.LoadFreelancerJobOffer( {search: this.searchModel} ));
  }
  inviteJobpageChange(event: any) {
    const pageIndex = event.pageIndex + 1;
    this.searchModel = {...this.searchModel, page: pageIndex};
    // this.store.dispatch(new fromJobAction.LoadFreelancerJobOffer({ search: this.searchModel }));
  }
}
