import * as fromCustomerAssignment from '../state/index';
import * as fromCustomerAssignmentAction from '../state/customer-assignment.actions';
import * as fromUser from './../../root-state/user-state';
import * as moment from 'moment';

import {
  AssignmentVM,
  CustomerAssignmentSearchVM,
} from '../../model/assignment.model';
import { Component, HostListener, OnInit } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { Observable, of } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { AgentService } from '../../services/agent.service';
import { AllowedActions } from '../../constant/allowed-actions.constant';
import { AssignmentMappingService } from '../../services/mapping-services/assignment-mapping.service';
import { AssignmentService } from '../../services/assignment.service';
import { CheckinVM } from '../../model/checkin.model';
import { ClientMappingService } from '../../services/mapping-services';
import { ClientService } from '../../services/client.service';
import { ConfirmBoxComponent } from '../../core/confirm-box/confirm-box.component';
import { ContractTypesService } from '../../services/contract-types.service';
import { FileExportService } from '../../services/file-export.service';
import { FormConfig } from '../../constant/forms.constant';
import { FormatConfig } from '../../constant/formats.constant';
import { FormatService } from '../../services/format.service';
import { FreelancerService } from '../../services/freelancer.service';
import { JobMappingService } from '../../services/mapping-services/job-mapping.service';
import { JobService } from '../../services/job.service';
import { MY_FORMATS } from '../../model/date-format.model';
import { MatDialog } from '@angular/material/dialog';
import { OptionVM } from '../../model/option.model';
import { PrepareService } from '../../services/prepare.service';
import { ProjectService } from '../../services/project.service';
import { ReasonBoxComponent } from '../../core/reason-box/reason-box.component';
import { Router } from '@angular/router';
import { SiteService } from '../../services/site.service';
import { StorageService } from '../../services/storage.service';
import { TranslateService } from '../../services/translate.service';
import { UserService } from '../../services/user.service';
import { UserVM } from '../../model/user.model';
import { UsersMappingService } from '../../services/mapping-services/user-mapping.service';
import { UsersService } from '../../services/users.service';
import { environment } from 'src/environments/environment';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-customer-assignment-list',
  templateUrl: './customer-assignment-list.component.html',
  styleUrls: ['./customer-assignment-list.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class CustomerAssignmentListComponent implements OnInit {
  componentActive = true;
  hasFilter = false;

  clientLK: OptionVM[] = [];
  agentLK: OptionVM[] = [];
  statesLK: OptionVM[] = [];
  creatorLK: OptionVM[] = [];
  projectLK: OptionVM[] = [];
  siteLK: OptionVM[] = [];
  contractTypeLK: OptionVM[] = [];

  searchModel$: Observable<CustomerAssignmentSearchVM | undefined> = of({});
  searchModel: CustomerAssignmentSearchVM = {};
  result$: Observable<AssignmentVM[]> = of([]);
  meta$: Observable<any | undefined> = of(undefined);
  loading$: Observable<boolean> = of(false);
  noRecords$: Observable<boolean> = of(false);
  totalRecords$: Observable<number | undefined> = of(undefined);
  currentPage$: Observable<number | undefined> = of(undefined);
  pageSize$: Observable<number | undefined> = of(undefined);
  hasFullAccess$: Observable<boolean> = of(false);
  loggedInUser: UserVM | undefined = undefined;
  startDate: string | undefined = undefined;
  createdFrom: string | undefined = undefined;

  displayedColumns = [
    'jobTitle',
    'appointedTimeLabel',
    'siteFullAddress',
    'status',
    'createdAt',
    'createdBy',
    'action',
  ];

  searchForm = new FormGroup({
    client: new FormControl(''),
    agent: new FormControl(''),
    project: new FormControl(''),
    site: new FormControl(''),
    contractType: new FormControl(''),
    states: new FormControl([]),
    creator: new FormControl(''),
    createdFrom: new FormControl(''),
    createdTo: new FormControl(''),
    dateFrom: new FormControl(''),
    dateTo: new FormControl(''),
    search: new FormControl(''),
  });

  @HostListener('window:beforeunload', ['$event'])
  clearLocalStorage() {
    localStorage.removeItem('customer-assignment.search');
  }
  constructor(
    private fileExportService: FileExportService,
    private store: Store<fromCustomerAssignment.State>,
    private userStore: Store<fromUser.State>,
    private agentService: AgentService,
    private clientService: ClientService,
    private projectService: ProjectService,
    private siteService: SiteService,
    private usersService: UsersService,
    private jobService: JobService,
    private assignmentService: AssignmentService,
    private freelancerService: FreelancerService,
    private formatService: FormatService,
    private prepareService: PrepareService,
    private contractTypesService: ContractTypesService,
    private assignmentMappingService: AssignmentMappingService,
    private clientMappingService: ClientMappingService,
    private usersMappingService: UsersMappingService,
    private storageService: StorageService,
    private translateService: TranslateService,
    private router: Router,
    public dialog: MatDialog
  ) {}

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

    this.hasFullAccess$ = this.userStore.pipe(
      select(fromUser.isAllowed, {
        permissions: AllowedActions['manage-projects'],
      }),
      takeWhile(() => this.componentActive)
    );

    this.loading$ = this.store.pipe(
      select(fromCustomerAssignment.getLoading),
      takeWhile(() => this.componentActive)
    );
    this.result$ = this.store.pipe(
      select(fromCustomerAssignment.getSearchResult),
      takeWhile(() => this.componentActive)
    );
    this.meta$ = this.store.pipe(
      select(fromCustomerAssignment.getMetaData),
      takeWhile(() => this.componentActive)
    );
    this.noRecords$ = this.store.pipe(
      select(fromCustomerAssignment.getNoRecords),
      takeWhile(() => this.componentActive)
    );
    this.currentPage$ = this.store.pipe(
      select(fromCustomerAssignment.getCurrentIndex),
      takeWhile(() => this.componentActive)
    );
    this.totalRecords$ = this.store.pipe(
      select(fromCustomerAssignment.getTotalRecord),
      takeWhile(() => this.componentActive)
    );
    this.pageSize$ = this.store.pipe(
      select(fromCustomerAssignment.getPageSize),
      takeWhile(() => this.componentActive)
    );
    this.searchModel$ = this.store.pipe(
      select(fromCustomerAssignment.getSearchModel),
      takeWhile(() => this.componentActive)
    );

    const yesterdayDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
    this.searchForm.get('createdFrom')?.patchValue(yesterdayDate);

    this.getListFromSearchModel();
    this.getUpdatedFormValues();
  }

  getSelectedFilters() {
    const previous = this.storageService.get('customer-assignment.search');
    if (previous !== null) {
      const {
        client,
        agent,
        project,
        contractType,
        states,
        site,
        creator,
        createdFrom,
        createdTo,
        dateFrom,
        dateTo,
        search,
      } = JSON.parse(previous) as CustomerAssignmentSearchVM;
      this.searchForm.patchValue({
        client: client,
        agent: agent,
        project: project,
        contractType: contractType,
        site: site,
        states: states,
        creator: creator,
        createdFrom: createdFrom,
        createdTo: createdTo,
        dateFrom: dateFrom,
        dateTo: dateTo,
        search: search,
      });
    } else {
      const yesterday = moment
        .utc(moment().subtract(1, 'days'))
        .local()
        .format('YYYY-MM-DD hh:mm:ss');
      const searchModel: CustomerAssignmentSearchVM = {
        pageIndex: 1,
        pageSize: 50,
        sortBy: 'appointed_at',
        sortDir: 'asc',
        createdFrom: yesterday,
      };
      this.store.dispatch(
        new fromCustomerAssignmentAction.UpdateSearch(searchModel)
      );
    }
  }

  loadLookUps() {
    this.clientService.getClientLK().subscribe((res) => {
      this.clientLK = this.clientMappingService.clientLKResponseToVM(res);
    });

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

    this.usersService.getUsersByRoleLK('client').subscribe((res) => {
      this.creatorLK = this.usersMappingService.creatorLKResponseToVM(res);
      this.usersService.getUsersByRoleLK('field').subscribe((res) => {
        this.creatorLK = this.sortOption(
          this.creatorLK.concat(
            this.usersMappingService.creatorLKResponseToVM(res)
          )
        );
      });
    });

    this.translateService.get('projects').subscribe((p) => {
      this.translateService.get('common').subscribe((c) => {
        this.projectService.getProjectsLK().subscribe((res) => {
          this.projectLK = this.sortOption(
            res.data
              ? res.data.map((a) => {
                  const info =
                    this.translateService.instant(
                      'projects.fields.category.' + a.category
                    ) +
                    '-' +
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

    this.translateService.get('assignments.fields').subscribe((a) => {
      this.statesLK = FormConfig.assignments.others.states.map((a) => {
        return {
          value: a,
          text: this.translateService.instant('assignments.fields.states.' + a),
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
          res.client ||
          res.agent ||
          res.project ||
          res.site ||
          res.contractType ||
          res.states ||
          res.creator ||
          res.createdFrom ||
          res.createdTo ||
          res.dateFrom ||
          res.dateTo ||
          (res.search?.length && res.search?.length > 2)
        ) {
          this.hasFilter = true;
          this.store.dispatch(
            new fromCustomerAssignmentAction.LoadCustomerAssignmentList({
              search: this.searchModel,
            })
          );
        } else {
          this.hasFilter = false;
          this.store.dispatch(
            new fromCustomerAssignmentAction.LoadCustomerAssignmentList({
              search: this.searchModel,
            })
          );
        }
      } else {
        const searchModel: CustomerAssignmentSearchVM = {
          pageIndex: 1,
          pageSize: 50,
          sortBy: 'appointed_at',
          sortDir: 'asc',
        };
        this.store.dispatch(
          new fromCustomerAssignmentAction.UpdateSearch(searchModel)
        );
      }
    });
  }

  getUpdatedFormValues() {
    this.searchForm.get('client')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, client: res };
      this.store.dispatch(
        new fromCustomerAssignmentAction.UpdateSearch(update)
      );
    });
    this.searchForm.get('agent')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, agent: res };
      this.store.dispatch(
        new fromCustomerAssignmentAction.UpdateSearch(update)
      );
    });
    this.searchForm.get('project')?.valueChanges.subscribe((res) => {
      if (res) {
        const update = { ...this.searchModel, pageIndex: 1, project: res };
        this.store.dispatch(
          new fromCustomerAssignmentAction.UpdateSearch(update)
        );
      } else {
        const update = {
          ...this.searchModel,
          pageIndex: 1,
          project: undefined,
        };
        this.store.dispatch(
          new fromCustomerAssignmentAction.UpdateSearch(update)
        );
      }
    });
    this.searchForm.get('site')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, site: res };
      this.store.dispatch(
        new fromCustomerAssignmentAction.UpdateSearch(update)
      );
    });
    this.searchForm.get('creator')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, creator: res };
      this.store.dispatch(
        new fromCustomerAssignmentAction.UpdateSearch(update)
      );
    });
    this.searchForm.get('contractType')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, contractType: res };
      this.store.dispatch(
        new fromCustomerAssignmentAction.UpdateSearch(update)
      );
    });
    this.searchForm.get('states')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, states: res };
      this.store.dispatch(
        new fromCustomerAssignmentAction.UpdateSearch(update)
      );
    });
    this.searchForm.get('createdFrom')?.valueChanges.subscribe((res) => {
      if (res !== null) {
        const update = {
          ...this.searchModel,
          pageIndex: 1,
          createdFrom: moment.utc(res).format('YYYY-MM-DD HH:MM:SS'),
        };
        this.store.dispatch(
          new fromCustomerAssignmentAction.UpdateSearch(update)
        );
      } else {
        const update = {
          ...this.searchModel,
          pageIndex: 1,
          createdFrom: undefined,
        };
        this.store.dispatch(
          new fromCustomerAssignmentAction.UpdateSearch(update)
        );
      }
    });
    this.searchForm.get('createdTo')?.valueChanges.subscribe((res) => {
      if (res !== null) {
        const update = {
          ...this.searchModel,
          pageIndex: 1,
          createdTo: moment.utc(res).format('YYYY-MM-DD HH:MM:SS'),
        };
        this.store.dispatch(
          new fromCustomerAssignmentAction.UpdateSearch(update)
        );
      } else {
        const update = {
          ...this.searchModel,
          pageIndex: 1,
          createdTo: undefined,
        };
        this.store.dispatch(
          new fromCustomerAssignmentAction.UpdateSearch(update)
        );
      }
    });
    this.searchForm.get('dateFrom')?.valueChanges.subscribe((res) => {
      if (res !== null) {
        this.startDate = moment.utc(res).format('YYYY-MM-DD HH:MM:SS');
        const update = {
          ...this.searchModel,
          pageIndex: 1,
          dateFrom: this.startDate,
        };
        this.store.dispatch(
          new fromCustomerAssignmentAction.UpdateSearch(update)
        );
      } else {
        const update = {
          ...this.searchModel,
          pageIndex: 1,
          dateFrom: undefined,
        };
        this.store.dispatch(
          new fromCustomerAssignmentAction.UpdateSearch(update)
        );
      }
    });
    this.searchForm.get('dateTo')?.valueChanges.subscribe((res) => {
      if (res !== null) {
        const update = {
          ...this.searchModel,
          pageIndex: 1,
          dateTo: moment.utc(res).format('YYYY-MM-DD HH:MM:SS'),
        };
        this.store.dispatch(
          new fromCustomerAssignmentAction.UpdateSearch(update)
        );
      } else {
        const update = {
          ...this.searchModel,
          pageIndex: 1,
          dateTo: undefined,
        };
        this.store.dispatch(
          new fromCustomerAssignmentAction.UpdateSearch(update)
        );
      }
    });
    this.searchForm.get('search')?.valueChanges.subscribe((res) => {
      if ((res && res.length > 2) || !res) {
        const update = { ...this.searchModel, pageIndex: 1, search: res };
        this.store.dispatch(
          new fromCustomerAssignmentAction.UpdateSearch(update)
        );
      }
    });
  }

  pageChange(event: any) {
    const update = {
      ...this.searchModel,
      pageSize: event.pageSize,
      pageIndex: event.pageIndex + 1,
    };
    this.store.dispatch(new fromCustomerAssignmentAction.UpdateSearch(update));
  }

  navigateToDetail(assignment: AssignmentVM) {
    this.router.navigate(['/assignments', assignment.id]);
  }

  navigateToCreateTender(assignment: AssignmentVM) {
    // TODO: Go to tender/create page with assignmentId
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
            new fromCustomerAssignmentAction.DeleteCustomerAssignment(
              assignment.id
            )
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
            new fromCustomerAssignmentAction.UpdateCheckin({
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
            new fromCustomerAssignmentAction.UpdateCustomerAssignment({
              id: assignment.id,
              assignment: obj,
            })
          );
        }
      });
    }
  }

  download() {
    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
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
          order_by: 'appointed_at',
          order_dir: 'asc',
          view: 'agent',
          client_id: this.searchModel.client ? this.searchModel.client : undefined,
          agent_id: this.searchModel.agent ? this.searchModel.agent : undefined,
          project: this.searchModel.project ? this.searchModel.project : undefined,
          site: this.searchModel.site ? this.searchModel.site : undefined,
          contract_type_id: this.searchModel.contractType ? this.searchModel.contractType : undefined,
          states: this.searchModel.states ? this.searchModel.states: undefined,
          creator_id: this.searchModel.creator ? this.searchModel.creator: undefined,
          created_from: this.searchModel.createdFrom ? this.searchModel.createdFrom: undefined,
          created_to: this.searchModel.createdTo ? this.searchModel.createdTo: undefined,
          date_from: this.searchModel.dateFrom ? this.searchModel.dateFrom: undefined,
          date_to: this.searchModel.dateTo ? this.searchModel.dateTo: undefined,
          only_client_created: true,
          timestamp: moment().unix(),
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
          fileName:
            `_assignments` + this.prepareService.date(new Date(), true) + '.csv',
          mimeType: 'text/csv;charset=UTF-8',
        });
      }
    });
  }
}
