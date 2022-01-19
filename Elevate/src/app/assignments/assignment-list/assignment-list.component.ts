import * as fromAssignment from '../state/index';
import * as fromAssignmentAction from '../state/assignment.actions';
import * as fromUser from './../../root-state/user-state';
import * as moment from 'moment';

import { AssignmentSearchVM, AssignmentVM } from '../../model/assignment.model';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { AgentService } from '../../services/agent.service';
import { AllowedActions } from '../../constant/allowed-actions.constant';
import { AssignmentService } from '../../services/assignment.service';
import { CheckinVM } from '../../model/checkin.model';
import { ConfirmBoxComponent } from '../../core/confirm-box/confirm-box.component';
import { ContractTypesService } from '../../services/contract-types.service';
import { FileExportService } from '../../services/file-export.service';
import { FormConfig } from '../../constant/forms.constant';
import { FreelancerService } from '../../services/freelancer.service';
import { JobService } from '../../services/job.service';
import { MatDialog } from '@angular/material/dialog';
import { OptionVM } from '../../model/option.model';
import { PrepareService } from '../../services/prepare.service';
import { ProjectService } from '../../services/project.service';
import { ReasonBoxComponent } from '../../core/reason-box/reason-box.component';
import { Router } from '@angular/router';
import { SearchRequestVM } from '../../model/search.model';
import { SiteService } from '../../services/site.service';
import { StorageService } from '../../services/storage.service';
import { TranslateService } from '../../services/translate.service';
import { UserVM } from '../../model/user.model';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-assignment-list',
  templateUrl: './assignment-list.component.html',
  styleUrls: ['./assignment-list.component.scss'],
})
export class AssignmentListComponent implements OnInit {
  componentActive = true;
  hasFilter = false;

  agentLK: OptionVM[] = [];
  projectLK: OptionVM[] = [];
  siteLK: OptionVM[] = [];
  jobLK: OptionVM[] = [];
  contractTypeLK: OptionVM[] = [];
  statesLK: OptionVM[] = [];
  freelancerLK: OptionVM[] = [];
  invoiceStateLK: OptionVM[] = [];

  searchModel$: Observable<AssignmentSearchVM | undefined> = of({});
  searchModel: AssignmentSearchVM = {};
  result$: Observable<AssignmentVM[]> = of([]);
  meta$: Observable<any | undefined> = of(undefined);
  loading$: Observable<boolean> = of(false);
  noRecords$: Observable<boolean> = of(false);
  totalRecords$: Observable<number | undefined> = of(undefined);
  currentPage$: Observable<number | undefined> = of(undefined);
  pageSize$: Observable<number | undefined> = of(undefined);
  hasFullAccess$: Observable<boolean> = of(false);
  loggedInUser: UserVM | undefined = undefined;
  jobId: any;
  dateTo: string;
  isClientUser: boolean = false;
  isFieldUser: boolean = false;
  selectedState: string | undefined = undefined;
  startDate: string | undefined = undefined;
  tenderBtnEnabled: boolean = false;
  cancelBtnEnabled: boolean = false;

  displayedColumns = [
    'jobTitle',
    'appointedTimeLabel',
    'siteFullAddress',
    'freelancerName',
    'status',
    'invoiceState',
    'action',
  ];

  searchForm = new FormGroup({
    agent: new FormControl(''),
    project: new FormControl(''),
    site: new FormControl(''),
    job: new FormControl(''),
    contractType: new FormControl(''),
    states: new FormControl([]),
    only_missing_docs: new FormControl(''),
    freelancer: new FormControl(''),
    invoiceState: new FormControl(''),
    onlyBillable: new FormControl(''),
    onlyBilled: new FormControl(''),
    dateFrom: new FormControl(''),
    dateTo: new FormControl(''),
    search: new FormControl(''),
  });

  @HostListener('window:beforeunload', ['$event'])
  clearLocalStorage() {
    localStorage.removeItem('assignment.search');
  }

  constructor(
    private fileExportService: FileExportService,
    private store: Store<fromAssignment.State>,
    private userStore: Store<fromUser.State>,
    private agentService: AgentService,
    private projectService: ProjectService,
    private siteService: SiteService,
    private jobService: JobService,
    private assignmentService: AssignmentService,
    private freelancerService: FreelancerService,
    private prepareService: PrepareService,
    private contractTypesService: ContractTypesService,
    private storageService: StorageService,
    private translateService: TranslateService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.jobId = this.router.getCurrentNavigation()?.extras.state?.jobId;
    this.dateTo = this.router.getCurrentNavigation()?.extras.state?.dateTo;
  }

  ngOnInit(): void {
    this.getSelectedFilters();
    this.loadLookUps();

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

    this.hasFullAccess$ = this.userStore.pipe(
      select(fromUser.isAllowed, {
        permissions: AllowedActions['manage-projects'],
      }),
      takeWhile(() => this.componentActive)
    );

    this.loading$ = this.store.pipe(
      select(fromAssignment.getLoading),
      takeWhile(() => this.componentActive)
    );
    this.result$ = this.store.pipe(
      select(fromAssignment.getSearchResult),
      takeWhile(() => this.componentActive)
    );
    this.meta$ = this.store.pipe(
      select(fromAssignment.getMetaData),
      takeWhile(() => this.componentActive)
    );
    this.noRecords$ = this.store.pipe(
      select(fromAssignment.getNoRecords),
      takeWhile(() => this.componentActive)
    );
    this.currentPage$ = this.store.pipe(
      select(fromAssignment.getCurrentIndex),
      takeWhile(() => this.componentActive)
    );
    this.totalRecords$ = this.store.pipe(
      select(fromAssignment.getTotalRecord),
      takeWhile(() => this.componentActive)
    );
    this.pageSize$ = this.store.pipe(
      select(fromAssignment.getPageSize),
      takeWhile(() => this.componentActive)
    );
    this.searchModel$ = this.store.pipe(
      select(fromAssignment.getSearchModel),
      takeWhile(() => this.componentActive)
    );
    this.getUpdatedFormValues();
    this.getListFromSearchModel();
  }

  getSelectedFilters() {
    const previous = this.storageService.get('assignment.search');
    if (previous !== null) {
      const {
        agent,
        project,
        contractType,
        states,
        site,
        job,
        onlyBillable,
        onlyBilled,
        only_missing_docs,
        freelancer,
        dateFrom,
        dateTo,
        invoiceState,
        search,
      } = JSON.parse(previous) as AssignmentSearchVM;
      this.searchForm.patchValue({
        agent: agent,
        job: job,
        project: project,
        contractType: contractType,
        site: site,
        states: states,
        dateFrom: dateFrom,
        dateTo: dateTo,
        freelancer: freelancer,
        invoiceState: invoiceState,
        onlyBillable: onlyBillable,
        onlyBilled: onlyBilled,
        only_missing_docs: only_missing_docs,
        search: search,
      });
    } else {
      const searchModel: AssignmentSearchVM = {
        pageIndex: 1,
        pageSize: 50,
        sortBy: 'appointed_at',
        sortDir: 'asc',
      };
      this.store.dispatch(new fromAssignmentAction.UpdateSearch(searchModel));
      this.searchForm.patchValue({ states: ['booked'] });
      const update = { ...this.searchModel, pageIndex: 1, states: ['booked'] };
      this.store.dispatch(new fromAssignmentAction.UpdateSearch(update));
    }
  }

  loadLookUps() {
    this.agentService.getAgentsLK().subscribe((res) => {
      this.agentLK = this.sortOption(
        res.data
          ? res.data.map((a) => {
              return {
                value: a.id,
                text: [a.lastname, a.firstname].join(' '),
              };
            })
          : []
      );
    });

    this.translateService.get('projects').subscribe((p) => {
      this.translateService.get('common').subscribe((c) => {
        this.projectService.getProjectsLK().subscribe((res) => {
          this.projectLK = this.sortOption(
            res.data
              ? res.data.map((a) => {
                  const info =
                    this.translateService.instant(
                      'projects.fields.state.' + a.state
                    ) +
                    (a.state === 'active'
                      ? ' ' +
                        this.translateService.instant('common.labels.since') +
                        ' ' +
                        a.started_at
                      : '') +
                    (a.state === 'closed'
                      ? ' ' +
                        this.translateService.instant('common.labels.since') +
                        ' ' +
                        a.finished_at
                      : '') +
                    (a.state === 'draft'
                      ? ' ' +
                        this.translateService.instant('common.labels.from') +
                        ' ' +
                        a.started_at
                      : '');
                  return {
                    value: a.id,
                    text: a.name,
                    data: { clientId: a.client_id },
                    info: info,
                  };
                })
              : []
          );
        });
      });
    });

    this.siteService.getSiteLK().subscribe((res) => {
      this.siteLK = res.data
        ? res.data.map((a) => {
            return {
              value: a.id,
              text: a.name + (a.number ? ' | ' + a.number : ''),
              info:
                a.zip +
                ' ' +
                a.city +
                ', ' +
                a.address +
                (a.country ? ', ' + a.country : ''),
            };
          })
        : [];
    });

    this.jobService.getJobsLK().subscribe((res) => {
      this.jobLK = this.sortOption(
        res.data
          ? res.data.map((a) => {
              return {
                value: a.id,
                text: a.title,
              };
            })
          : []
      );
    });

    this.translateService.get('contracts').subscribe((p) => {
      this.contractTypesService.getContractTypes({}).subscribe((res) => {
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

    this.freelancerService.getFreelancerLK().subscribe((res) => {
      this.freelancerLK = this.sortOption(
        res.data
          ? res.data.map((a) => {
              return {
                value: a.id,
                text: a.lastname + ' ' + a.firstname,
                info: a.zip + ' ' + a.city,
              };
            })
          : []
      );
    });

    this.translateService.get('assignments.fields').subscribe((a) => {
      const userType =
        this.isClientUser || this.isFieldUser ? 'client' : 'others';
      if (userType === 'client') {
        this.statesLK = FormConfig.assignments.client.states.map((a) => {
          return {
            value: a,
            text: this.translateService.instant(
              'assignments.fields.states.' + a
            ),
          };
        });
      }

      if (userType === 'others') {
        this.statesLK = FormConfig.assignments.others.states.map((a) => {
          return {
            value: a,
            text: this.translateService.instant(
              'assignments.fields.states.' + a
            ),
          };
        });
      }
    });

    this.translateService.get('invoices.fields').subscribe((a) => {
      this.invoiceStateLK = FormConfig.invoices.states.map((a) => {
        return {
          value: a,
          text: this.translateService.instant('invoices.fields.states.' + a),
        };
      });
    });
  }

  sortOption(options: OptionVM[]) {
    return options.sort((a: OptionVM, b: OptionVM) =>
      a.text && b.text ? (a.text > b.text ? 1 : b.text > a.text ? -1 : 0) : 0
    );
  }

  getListFromSearchModel() {
    this.searchModel$.subscribe((res) => {
      if (res) {
        this.searchModel = res;
        if (
          res.agent ||
          res.project ||
          res.site ||
          res.job ||
          res.contractType ||
          res.states ||
          res.dateFrom ||
          res.dateTo ||
          res.freelancer ||
          res.invoiceState ||
          res.onlyBillable ||
          res.onlyBilled ||
          res.only_missing_docs ||
          (res.search?.length && res.search?.length > 2)
        ) {
          this.hasFilter = true;
          this.store.dispatch(
            new fromAssignmentAction.LoadAssignmentList({
              search: this.searchModel,
            })
          );
          if (this.selectedState && this.selectedState.length) {
            this.cancelEnabled();
            if (this.startDate) {
              this.tenderEnabled();
            }
          }
        } else {
          this.hasFilter = false;
          this.store.dispatch(
            new fromAssignmentAction.LoadAssignmentList({
              search: this.searchModel,
            })
          );
        }
      } else {
        const searchModel: AssignmentSearchVM = {
          pageIndex: 1,
          pageSize: 50,
          sortBy: 'appointed_at',
          sortDir: 'asc',
        };
        this.store.dispatch(new fromAssignmentAction.UpdateSearch(searchModel));
      }
    });
  }

  getUpdatedFormValues() {
    this.searchForm.get('agent')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, agent: res };
      this.store.dispatch(new fromAssignmentAction.UpdateSearch(update));
    });
    this.searchForm.get('project')?.valueChanges.subscribe((res) => {
      if (res) {
        const update = { ...this.searchModel, pageIndex: 1, project: res };
        this.store.dispatch(new fromAssignmentAction.UpdateSearch(update));
        this.getJobsByProject(res);
      } else {
        const update = {
          ...this.searchModel,
          pageIndex: 1,
          project: undefined,
        };
        this.store.dispatch(new fromAssignmentAction.UpdateSearch(update));
      }
    });
    this.searchForm.get('site')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, site: res };
      this.store.dispatch(new fromAssignmentAction.UpdateSearch(update));
    });
    this.searchForm.get('job')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, job: res };
      this.store.dispatch(new fromAssignmentAction.UpdateSearch(update));
    });
    this.searchForm.get('contractType')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, contractType: res };
      this.store.dispatch(new fromAssignmentAction.UpdateSearch(update));
    });
    this.searchForm.get('states')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, states: res };
      this.selectedState = res;
      this.store.dispatch(new fromAssignmentAction.UpdateSearch(update));
    });
    this.searchForm.get('dateFrom')?.valueChanges.subscribe((res) => {
      if (res !== null) {
        this.startDate = moment.utc(res).local().format('YYYY-MM-DD HH:MM:SS');
        const update = {
          ...this.searchModel,
          pageIndex: 1,
          dateFrom: this.startDate,
        };
        this.store.dispatch(new fromAssignmentAction.UpdateSearch(update));
      } else {
        const update = {
          ...this.searchModel,
          pageIndex: 1,
          dateFrom: undefined,
        };
        this.store.dispatch(new fromAssignmentAction.UpdateSearch(update));
      }
    });
    this.searchForm.get('dateTo')?.valueChanges.subscribe((res) => {
      if (res !== null) {
        const update = {
          ...this.searchModel,
          pageIndex: 1,
          dateTo: moment.utc(res).local().format('YYYY-MM-DD HH:MM:SS'),
        };
        this.store.dispatch(new fromAssignmentAction.UpdateSearch(update));
      } else {
        const update = {
          ...this.searchModel,
          pageIndex: 1,
          dateTo: undefined,
        };
        this.store.dispatch(new fromAssignmentAction.UpdateSearch(update));
      }
    });
    if (this.dateTo) {
      const dateFrom = moment(this.dateTo).subtract(1, 'days').format('YYYY-MM-DD');
      const dateTimeFrom = moment.utc(moment(this.dateTo).subtract(1, 'days')).local().format('YYYY-MM-DD HH:MM:SS');
      const dateTimeTo = moment(this.dateTo).utc().local().format('YYYY-MM-DD HH:MM:SS');

      this.searchForm.get('dateFrom')?.patchValue(dateFrom);
      this.searchForm.get('dateTo')?.patchValue(this.dateTo);
      const update = { ...this.searchModel, pageIndex: 1, dateFrom: dateTimeFrom, dateTo: dateTimeTo };
      this.store.dispatch(new fromAssignmentAction.UpdateSearch(update));
    }
    this.searchForm.get('freelancer')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, freelancer: res };
      this.store.dispatch(new fromAssignmentAction.UpdateSearch(update));
    });
    this.searchForm.get('invoiceState')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, invoiceState: res };
      this.store.dispatch(new fromAssignmentAction.UpdateSearch(update));
    });
    this.searchForm.get('onlyBillable')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, onlyBillable: res };
      this.store.dispatch(new fromAssignmentAction.UpdateSearch(update));
    });
    this.searchForm.get('onlyBilled')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, onlyBilled: res };
      this.store.dispatch(new fromAssignmentAction.UpdateSearch(update));
    });
    this.searchForm.get('only_missing_docs')?.valueChanges.subscribe((res) => {
      const update = {
        ...this.searchModel,
        pageIndex: 1,
        only_missing_docs: res,
      };
      this.store.dispatch(new fromAssignmentAction.UpdateSearch(update));
    });
    this.searchForm.get('search')?.valueChanges.subscribe((res) => {
      if ((res && res.length > 2) || !res) {
        const update = { ...this.searchModel, pageIndex: 1, search: res };
        this.store.dispatch(new fromAssignmentAction.UpdateSearch(update));
      }
    });
    if (this.jobId) {
      this.searchForm.get('job')?.patchValue(this.jobId);
      const update = { ...this.searchModel, pageIndex: 1, job: this.jobId };
      this.store.dispatch(new fromAssignmentAction.UpdateSearch(update));
    }
  }

  getJobsByProject(id: string) {
    const searchRequest: SearchRequestVM = {};
    searchRequest.limit = 100000;
    searchRequest.order_by = 'title';
    searchRequest.only_fields = ['job.id', 'job.title'];
    searchRequest.filters = [{ key: 'project_id', value: id }];

    this.jobService.getJobs(searchRequest).subscribe((res) => {
      this.jobLK = this.sortOption(
        res.data
          ? res.data.map((a) => {
              return {
                value: a.id,
                text: a.title,
              };
            })
          : []
      );
    });
  }

  pageChange(event: any) {
    const update = {
      ...this.searchModel,
      pageSize: event.pageSize,
      pageIndex: event.pageIndex + 1,
    };
    this.store.dispatch(new fromAssignmentAction.UpdateSearch(update));
  }

  navigateToDetail(assignment: AssignmentVM) {
    this.router.navigate(['/assignments', assignment.id]);
  }

  navigateToCreateTender(assignment: AssignmentVM) {
    this.router.navigate(['/tenders/create', assignment.id]);
  }

  navigateToUpdateTender(assignment: AssignmentVM) {
    // TODO: Go to tender page with ActiveTenderId (i.e. assignment tender with !(item.state === 'expired'))
  }

  deleteRecord(assignment: AssignmentVM) {
    if (assignment.id) {
      const dialogRef = this.dialog.open(ConfirmBoxComponent, {
        data: {
          type: 'warning',
          title: this.translateService.instant(
            'assignments.table.remove.title'
          ),
          message: this.translateService.instant(
            'assignments.table.remove.message'
          ),
          cancelCode: 'common.buttons.cancel',
          confirmCode: 'common.buttons.yes-remove',
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result && assignment.id) {
          this.store.dispatch(
            new fromAssignmentAction.DeleteAssignment(assignment.id)
          );
        }
      });
    }
  }

  modifyTime(assignment: AssignmentVM) {
    if (assignment.id) {
      const startTime = moment
        .utc(assignment.checkins[0].performed_at)
        .local()
        .format('HH:mm');
      const endTime = assignment.checkins[0].finished_at ? moment
        .utc(assignment.checkins[0].finished_at)
        .local()
        .format('HH:mm') : '';
      const timeRange = startTime + ' - ' + endTime;
      const dialogRef = this.dialog.open(ReasonBoxComponent, {
        data: {
          type: 'warning',
          title: this.translateService.instant(
            'assignments.table.modifytime.title'
          ),
          message: this.translateService.instant(
            'assignments.table.modifytime.message'
          ),
          label: this.translateService.instant(
            'assignments.table.modifytime.placeholder'
          ),
          inputFieldType: 'timeRange',
          fieldValue: timeRange,
          cancelCode: 'assignment.update-hours.buttons.cancel',
          confirmCode: 'assignment.update-hours.buttons.confirm',
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result && assignment.id) {
          const time = result.timeRange.split(/[ ]*-[ ]*/);
          const start = this.prepareService.datetime(
            this.prepareService.date(assignment.date?.data.appointed_at, true) +
              ' ' +
              time[0]
          );
          const end = this.prepareService.datetime(
            this.prepareService.date(assignment.date?.data.appointed_at, true) +
              ' ' +
              time[1]
          );
          const obj: CheckinVM = { performed_at: start, finished_at: end };
          this.store.dispatch(
            new fromAssignmentAction.UpdateCheckin({
              id: assignment.checkins[0].id,
              checkin: obj,
            })
          );
        }
      });
    }
  }

  updateComment(assignment: AssignmentVM) {
    if (assignment.id) {
      const dialogRef = this.dialog.open(ReasonBoxComponent, {
        data: {
          type: 'warning',
          title: this.translateService.instant(
            'assignments.table.update-comment.title'
          ),
          message: this.translateService.instant(
            'assignments.table.update-comment.message'
          ),
          label: this.translateService.instant(
            'assignments.table.update-comment.placeholder'
          ),
          needReason: true,
          cancelCode: 'assignment.update-comment.buttons.cancel',
          confirmCode: 'assignment.update-comment.buttons.confirm',
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result && assignment.id) {
          const obj = {
            comment: result.reason,
          };
          this.store.dispatch(
            new fromAssignmentAction.UpdateAssignment({
              id: assignment.id,
              assignment: obj,
            })
          );
        }
      });
    }
  }

  tenderEnabled() {
    const today = new Date();
    this.noRecords$.subscribe((res) => {
      this.tenderBtnEnabled =
        this.selectedState?.length === 1 &&
        this.selectedState[0] === 'open' &&
        moment(today).diff(this.startDate, 'days') <= 0 &&
        !res;
    });
  }

  cancelEnabled() {
    this.noRecords$.subscribe((res) => {
      this.cancelBtnEnabled =
        this.selectedState?.length === 1 &&
        this.selectedState[0] === 'booked' &&
        !res;
    });
  }

  postAllTenders() {
    let count = 0;
    this.meta$.subscribe((res) => {
      count = res.count;
    });
    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      maxWidth: '480px',
      data: {
        type: 'warning',
        title: this.translateService.instant(
          'assignments.tender-assignments.title'
        ),
        message: this.translateService.instant(
          'assignments.tender-assignments.message',
          { count: count }
        ),
        cancelCode: 'common.buttons.cancel',
        confirmCode: 'common.buttons.yes-remove',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      }
    });
  }

  cancelAllBookings() {
    let count = 0;
    this.meta$.subscribe((res) => {
      count = res.count;
    });
    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      maxWidth: '450px',
      data: {
        type: 'warning',
        title: this.translateService.instant(
          'assignments.cancel-booking.title'
        ),
        message: this.translateService.instant(
          'assignments.cancel-booking.message',
          { count: count }
        ),
        cancelCode: 'common.buttons.cancel',
        confirmCode: 'common.buttons.yes-cancel-booking',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result);
      }
    });
  }

  download() {
    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      maxWidth: '480px',
      data: {
        type: 'warning',
        title: this.translateService.instant(
          'assignments.download.confirm.title'
        ),
        message: this.translateService.instant(
          'assignments.download.confirm.message'
        ),
        cancelCode: 'assignments.download.confirm.buttons.cancel',
        confirmCode: 'assignments.download.confirm.buttons.confirm',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const obj: any = {
          timestamp: moment().unix(),
          order_by: 'appointed_at',
          order_dir: 'asc',
          view: 'agent',
          agent_id: this.searchModel.agent ? this.searchModel.agent : undefined,
          project: this.searchModel.project
            ? this.searchModel.project
            : undefined,
          job: this.searchModel.job ? this.searchModel.job : undefined,
          freelancer: this.searchModel.freelancer
            ? this.searchModel.freelancer
            : undefined,
          states: this.searchModel.states ? this.searchModel.states : undefined,
          date_from: this.searchModel.dateFrom
            ? this.searchModel.dateFrom
            : undefined,
          date_to: this.searchModel.dateTo
            ? this.searchModel.dateTo
            : undefined,
          site: this.searchModel.site ? this.searchModel.site : undefined,
          invoice_state: this.searchModel.invoiceState
            ? this.searchModel.invoiceState
            : undefined,
          contract_type_id: this.searchModel.contractType
            ? this.searchModel.contractType
            : undefined,
          only_missing_docs: this.searchModel.only_missing_docs
            ? this.searchModel.only_missing_docs
            : undefined,
          only_billable: this.searchModel.onlyBillable
            ? this.searchModel.onlyBillable
            : undefined,
          only_billed: this.searchModel.onlyBilled
            ? this.searchModel.onlyBilled
            : undefined,
        };
        const filters: { key: string; value: string | number | boolean }[] = [];
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            if (obj[key]) {
              filters.push({ key: key, value: obj[key] });
            }
          }
        }
        this.fileExportService.getDownload({
          url: this.assignmentService.downloadAssignmentsUrl(filters),
          fileName: `_assignments`,
          mimeType: 'text/csv;charset=UTF-8',
        });
      }
    });
  }
}
