import * as fromCurrentUser from '../../root-state/user-state';
import * as fromJobAction from '../../jobs/state/job.actions';
import * as fromTender from '../state';
import * as fromTenderAction from '../state/tender.actions';
import * as moment from 'moment';

import { Component, OnInit } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { Observable, of } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { Accounting } from '../../model/accounting.model';
import { AgentService } from '../../services/agent.service';
import { ApprovalRequestVM } from '../../model/approval-request.model';
import { ClientService } from '../../services/client.service';
import {ConfirmBoxComponent} from "../../core/confirm-box/confirm-box.component";
import { ContractTypesService } from '../../services/contract-types.service';
import { FileExportService } from '../../services/file-export.service';
import { FormConfig } from '../../constant/forms.constant';
import { FreelancerService } from '../../services/freelancer.service';
import { JobService } from '../../services/job.service';
import { LoadFreelancerOfferTM } from '../state/tender.actions';
import { MY_FORMATS } from '../../model/date-format.model';
import {MatDialog} from "@angular/material/dialog";
import { OptionVM } from '../../model/option.model';
import { ProjectService } from '../../services/project.service';
import { Router } from '@angular/router';
import { SiteService } from '../../services/site.service';
import { StorageService } from '../../services/storage.service';
import { TenderSearchVM } from '../../model/tender.model';
import { TenderService } from '../../services/tender.service';
import { TranslateService } from '../../services/translate.service';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class OffersComponent implements OnInit {
  offers = new FormGroup({
    agent: new FormControl(),
    client: new FormControl(),
    contractType: new FormControl(),
    project: new FormControl(),
    site: new FormControl(),
    job: new FormControl(),
    freelancer: new FormControl(),
    start: new FormControl(),
    end: new FormControl(),
    search: new FormControl(),
    status: new FormControl(['pending']),
  });
  agentLK: OptionVM[] = [];
  clientLK: OptionVM[] = [];
  // @ts-ignore
  stateLK: OptionVM[] = [];
  projectLK: OptionVM[] = [];
  contractTypeLK: OptionVM[] = [];
  jobLK: OptionVM[] = [];
  siteLK: OptionVM[] = [];
  freelancerLK: OptionVM[] = [];
  searchModel$: Observable<TenderSearchVM | undefined> = of({});
  freelancerSearchModel$: Observable<TenderSearchVM | undefined> = of({});
  searchModel: any = {};
  freelancerSearchModel: any = {};
  componentActive = true;
  offerList: OptionVM[] = [];
  freelancerOfferList: any[] = [];
  hasFilter = false;
  loggedRole: string | undefined = '';
  totalRecord: any;
  currentPage: any;
  totalPage: any;
  paginator: any;
  viewing: string = 'Tile';
  displayedColumns = [
    'Client',
    'Job Name',
    'Category',
    'City',
    'Post Code',
    'Site Address',
    'Date',
    'action',
  ];
  displayedAdminColumns = [
    'jobTitle',
    'sitePlace',
    'roleName',
    'shiftName',
    'appointedAt',
    'freelancerName',
    'expiredAt',
    'action',
  ];
  noRecords$: Observable<boolean> = of(false);

  constructor(
    private agentService: AgentService,
    private store: Store<fromTender.State>,
    private translateService: TranslateService,
    private contractTypesService: ContractTypesService,
    private jobService: JobService,
    private clientService: ClientService,
    private projectService: ProjectService,
    private freelancerService: FreelancerService,
    private siteService: SiteService,
    private storageService: StorageService,
    private router: Router,
    private tenderService: TenderService,
    private fileExportService: FileExportService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.store.select(fromCurrentUser.getCurrentUserInfo).subscribe((res) => {
      if (res) {
        this.loggedRole = res?.role;
        if (this.loggedRole !== 'freelancer') {
          this.loadLookUps();
          this.getSelectedFilters();
          // this.searchModel$.subscribe((res: any) => {
          //   if (res) {
          //     this.searchModel = res;
          //     if (
          //       res.agent ||
          //       res.client ||
          //       res.project ||
          //       res.site ||
          //       res.contractType ||
          //       res.start ||
          //       res.end ||
          //       res.job ||
          //       res.freelancer ||
          //       res.status ||
          //       (res.search?.length && res.search?.length > 2)
          //     ) {
          //       debugger
          //       this.hasFilter = true;
          //       this.store.dispatch(
          //         new fromTenderAction.LoadOffer({ search: this.searchModel })
          //       );
          //     }
          //   } else {
          //     const searchModel: TenderSearchVM = {
          //       pageIndex: 1,
          //       pageSize: 12,
          //       sortBy: 'appointed_at',
          //     };
          //     this.store.dispatch(
          //       new fromTenderAction.UpdateOfferSearch(searchModel)
          //     );
          //   }
          // });
        } else if (this.loggedRole === 'freelancer') {
          this.loadLookUpsFreelancer();
          this.getSelectedFreelancerFilters();
          this.freelancerSearchModel$.subscribe((searchResult: any) => {
            if (searchResult) {
              this.freelancerSearchModel = searchResult;
              if (
                searchResult.contractType ||
                searchResult.status ||
                (searchResult.search?.length && searchResult.search?.length > 2)
              ) {
                this.hasFilter = true;
                this.store.dispatch(
                  new fromTenderAction.LoadFreelancerOfferTM({
                    search: this.freelancerSearchModel,
                  })
                );
              }
            } else {
              const freelancerSearchModel: TenderSearchVM = {
                pageIndex: 1,
                pageSize: 12,
                sortBy: 'appointed_at',
              };
              this.store.dispatch(
                new fromTenderAction.UpdateFreelancerOfferSearch(
                  freelancerSearchModel
                )
              );
            }
          });
        }
      }
      if (this.loggedRole === 'freelancer') {
        this.freelancerSearchModel$ = this.store.pipe(
          select(fromTender.getSearchModel),
          takeWhile(() => this.componentActive)
        );
        this.store.dispatch(
          new fromTenderAction.LoadFreelancerOfferTM({
            search: this.freelancerSearchModel,
          })
        );
        this.store.select(fromTender.getFreelancerOffersList).subscribe(
          // tslint:disable-next-line:no-shadowed-variable
          (res: any) => {
            if (res) {
              this.totalRecord = res?.data?.meta?.pagination?.total;
              this.currentPage = res?.data?.meta?.pagination?.current_page;
              this.totalPage = res?.data?.meta?.count;
              this.freelancerOfferList = this.sortOption(
                res?.data?.data
                  ? res?.data?.data.map((a: any) => {
                      return {
                        id: a?.id,
                        category:
                          a?.tender?.data?.snapshots?.assignment?.category,
                        identifier:
                          a?.tender?.data?.contract_type?.data?.identifier,
                        name: a?.tender?.data?.snapshots?.job?.title,
                        subName: a?.tender?.data?.snapshots?.client?.name,
                        siteGroup: a?.tender?.data?.snapshots?.site?.group,
                        siteName: a?.tender?.data?.snapshots?.site?.name,
                        siteNumber: a?.tender?.data?.snapshots?.site?.number,
                        siteAddress: a?.tender?.data?.snapshots?.site?.address,
                        siteZip: a?.tender?.data?.snapshots?.site?.zip,
                        siteCity: a?.tender?.data?.snapshots?.site?.city,
                        job_location: a?.tender?.data?.snapshots?.job?.job_location,
                        shiftStartTime: a?.tender?.data?.snapshots?.assignment?.shift_start_time.substr(0,5),
                        shiftEndTime: a?.tender?.data?.snapshots?.assignment?.shift_end_time.substr(0,5),
                        shiftName: a?.tender?.data?.snapshots?.assignment?.shift_name,
                        startEndDate: moment(a?.tender?.data?.snapshots?.job?.start_date).format('MMM DD, YYYY') + ' - ' + moment(a?.tender?.data?.snapshots?.job?.finish_date).format('MMM DD, YYYY'),
                        siteDate:
                          a?.tender?.data?.snapshots?.date?.appointed_at,
                        state: a?.status ? a.status : 'pending',
                        contractType:
                          a?.tender?.data?.contract_type?.data?.name,
                        rate_type: a?.tender?.data?.snapshots?.assignment?.rate_type,
                        rate: a?.tender?.data?.snapshots?.assignment?.rate,
                        checkin_location: a?.tender?.data?.snapshots?.assignment?.checkin_location,
                        currency: a?.tender?.data?.snapshots?.project?.currency,
                        staff: a?.staff?.fullname
                      };
                    })
                  : []
              );
            }
          }
        );
        this.offers.get('contractType')?.valueChanges.subscribe((r) => {
          this.freelancerSearchModel = {
            ...this.freelancerSearchModel,
            pageIndex: 1,
            contractType: r,
          };
          this.store.dispatch(
            new fromTenderAction.LoadFreelancerOfferTM({
              search: this.freelancerSearchModel,
            })
          );
        });
        this.offers.get('status')?.valueChanges.subscribe((result) => {
          this.freelancerSearchModel = {
            ...this.freelancerSearchModel,
            pageIndex: 1,
            status: result.join(),
          };
          this.store.dispatch(
            new fromTenderAction.LoadFreelancerOfferTM({
              search: this.freelancerSearchModel,
            })
          );
        });
        this.offers.get('search')?.valueChanges.subscribe((a) => {
          if (a && a.length > 2 || !a) {
            this.freelancerSearchModel = {
              ...this.searchModel,
              pageIndex: 1,
              search: a,
            };
            this.store.dispatch(
              new fromTenderAction.LoadFreelancerOfferTM({
                search: this.freelancerSearchModel,
              })
            );
          }
        });
      } else if (this.loggedRole !== 'freelancer') {
        this.searchModel$ = this.store.pipe(
          select(fromTender.getSearchModel),
          takeWhile(() => this.componentActive)
        );

        this.offers.get('agent')?.valueChanges.subscribe((data) => {
          this.searchModel = { ...this.searchModel, pageIndex: 1, agent: data };
          this.store.dispatch(new fromTenderAction.LoadOffer({search : this.searchModel}));
        });
        this.offers.get('client')?.valueChanges.subscribe((result) => {
          this.searchModel = { ...this.searchModel, pageIndex: 1, client: result };
          this.store.dispatch(new fromTenderAction.LoadOffer({search : this.searchModel}));
        });
        this.offers.get('contractType')?.valueChanges.subscribe((list) => {
          this.searchModel = {
            ...this.searchModel,
            pageIndex: 1,
            contractType: list,
          };
          this.store.dispatch(new fromTenderAction.LoadOffer({search: this.searchModel}));
        });
        this.offers.get('project')?.valueChanges.subscribe((outcome) => {
          this.searchModel = {
            ...this.searchModel,
            pageIndex: 1,
            project: outcome,
          };
          this.store.dispatch(new fromTenderAction.LoadOffer({search: this.searchModel}));
        });
        this.offers.get('site')?.valueChanges.subscribe((res) => {
          this.searchModel = { ...this.searchModel, pageIndex: 1, freelancer: res };
          this.store.dispatch(new fromTenderAction.LoadOffer({search: this.searchModel}));
        });
        this.offers.get('job')?.valueChanges.subscribe((j) => {
          this.searchModel = { ...this.searchModel, pageIndex: 1, job: j };
          this.store.dispatch(new fromTenderAction.LoadOffer({search: this.searchModel}));
        });
        this.offers.get('freelancer')?.valueChanges.subscribe((f) => {
          this.searchModel = { ...this.searchModel, pageIndex: 1, freelancer: f };
          this.store.dispatch(new fromTenderAction.LoadOffer({search: this.searchModel}));
        });
        this.offers.get('start')?.valueChanges.subscribe((s) => {
          if (s) {
            this.searchModel = {
              ...this.searchModel,
              pageIndex: 1,
              date_from: moment(s).format('YYYY-MM-DD') + ' 00:00:01',
            };
            this.store.dispatch(new fromTenderAction.LoadOffer({search: this.searchModel }));
          }
          else {
            this.searchModel = {
              ...this.searchModel,
              pageIndex: 1,
              date_from: undefined
            };
            this.store.dispatch(new fromTenderAction.LoadOffer({search: this.searchModel }));
          }
        });
        this.offers.get('end')?.valueChanges.subscribe((e) => {
          if (e) {
            this.searchModel = {
              ...this.searchModel,
              pageIndex: 1,
              date_to: moment(e).format('YYYY-MM-DD') + ' 00:00:01',
            };
            this.store.dispatch(new fromTenderAction.LoadOffer({search: this.searchModel }));
          }
          else {
            this.searchModel = {
              ...this.searchModel,
              pageIndex: 1,
              date_to: undefined
            };
            this.store.dispatch(new fromTenderAction.LoadOffer({ search: this.searchModel }));
          }
        });
        this.offers.get('search')?.valueChanges.subscribe((s) => {
          if (s && s.length > 2 || !s) {
            this.searchModel = {
              ...this.searchModel,
              pageIndex: 1,
              search: s,
            };
            this.store.dispatch(new fromTenderAction.LoadOffer({ search: this.searchModel }));
          }
        });
      }
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

    this.noRecords$ = this.store.pipe(
      select(fromTender.getNoRecords),
      takeWhile(() => this.componentActive)
    );
  }

  getSelectedFilters() {
    const previous = this.storageService.get('job.search');
    if (previous !== null) {
      const {
        agent,
        client,
        contractType,
        job,
        project,
        site,
        freelancer,
        start,
        end,
        search,
      } = JSON.parse(previous) as TenderSearchVM;
      this.offers.patchValue({
        agent: agent,
        client: client,
        contractType: contractType,
        job: job,
        project: project,
        site: site,
        freelancer: freelancer,
        start: start,
        end: end,
        search: search,
      });
    } else {
      const searchModel: TenderSearchVM = {
        pageIndex: 1,
        pageSize: 12,
        sortBy: 'appointed_at',
      };
      this.store.dispatch(new fromTenderAction.UpdateOfferSearch(searchModel));
    }
  }

  getSelectedFreelancerFilters() {
    const previous = this.storageService.get('job.search');
    if (previous !== null) {
      const { contractType, search, state } = JSON.parse(
        previous
      ) as TenderSearchVM;
      this.offers.patchValue({
        contractType,
        search,
        state,
      });
    } else {
      const freelancerSearchModel: TenderSearchVM = {
        pageIndex: 1,
        pageSize: 12,
      };
      this.store.dispatch(
        new fromTenderAction.UpdateFreelancerOfferSearch(freelancerSearchModel)
      );
    }
  }

  loadLookUps() {
    this.agentService.getAgentsLK().subscribe((res) => {
      this.agentLK = this.sortOption(
        res?.data
          ? res?.data.map((a) => {
              return {
                value: a.id,
                text: [a.lastname, a.firstname].join(' '),
              };
            })
          : []
      );
    });

    this.clientService.getClientLK().subscribe((res) => {
      this.clientLK = this.sortOption(
        res.data
          ? res.data.map((a) => {
              return {
                value: a.id,
                text: a.name,
              };
            })
          : []
      );
    });

    this.projectService.getProjectsLK().subscribe((res) => {
      this.projectLK = this.sortOption(
        res.data
          ? res.data.map((a) => {
              return {
                value: a.id,
                text: [a.name, a.category].join(' '),
              };
            })
          : []
      );
    });

    this.siteService.getSiteLK().subscribe((res) => {
      this.siteLK = this.sortOption(
        res.data
          ? res.data.map((a) => {
              return {
                value: a.id,
                text: [a.name, a.zip, a.city, a.address].join(' '),
              };
            })
          : []
      );
    });

    this.freelancerService.getFreelancerLK().subscribe((res) => {
      this.freelancerLK = this.sortOption(
        res.data
          ? res.data.map((a) => {
              return {
                value: a.id,
                text: [a.lastname, a.firstname, a.zip, a.city].join(' '),
              };
            })
          : []
      );
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
    this.store.dispatch(
      new fromTenderAction.LoadOffer({ search: this.searchModel })
    );

    this.store.select(fromTender.getOffersList).subscribe((res: any) => {
      if (res) {
        this.offerList = this.sortOption(
          res?.data?.data
            ? res?.data?.data?.map((a: any) => {
                return {
                  id: a?.id,
                  freelancer_id: a?.freelancer_id,
                  job: a?.job_title,
                  site_place: a?.site_place,
                  appointed_at: a?.appointed_at,
                  freelancer_name: a?.freelancer_fullname,
                  expired_at: a?.expired_at,
                  role_name: a?.role_name,
                  shift_name: a?.shift_name,
                  job_location: a?.job_location
                };
              })
            : []
        );
        this.paginator = res?.data?.meta?.pagination;
      }
    });
  }

  sortOption(options: OptionVM[]) {
    return options.sort((a: OptionVM, b: OptionVM) =>
      a.text && b.text ? (a.text > b.text ? 1 : b.text > a.text ? -1 : 0) : 0
    );
  }

  pageChange(event: any) {
    const update = {
      ...this.searchModel,
      pageSize: event.pageSize,
      pageIndex: event.pageIndex + 1,
    };
    this.store.dispatch(
      new fromTenderAction.UpdateFreelancerOfferSearch(update)
    );
  }

  pageChangeSubmittedOffer(event: any) {
    this.searchModel = {
      ...this.searchModel,
      pageSize: event.pageSize,
      pageIndex: event.pageIndex + 1,
    };
    this.store.dispatch(
      new fromTenderAction.LoadOffer({ search: this.searchModel })
    );
  }

  // downloadList() {
  //   const fieldNames = Object.keys(this).map((a) =>
  //     this.translateService.instant('accounting.files.table.' + a)
  //   );
  //   this.fileExportService.downloadCSV({ data: this, filePrefix: 'download', headerFields: fieldNames });
  // }

  loadLookUpsFreelancer() {
    this.translateService.get('tenders.offers.state').subscribe((a) => {
      this.stateLK = FormConfig.offers.state.map((a) => {
        return {
          value: a,
          text: this.translateService.instant('tenders.offers.state.' + a),
        };
      });
    });
  }

  navigateToDetail(row: any) {
    this.router.navigate(['tenders', 'offers', row.id]);
  }
}
