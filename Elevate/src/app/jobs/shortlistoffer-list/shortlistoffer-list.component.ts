import * as fromCurrentUser from './../../root-state/user-state';
import * as fromJob from './../state';
import * as fromJobAction from './../state/job.actions';
import * as fromTender from '../../tenders/state';
import * as fromTenderAction from '../../tenders/state/tender.actions';

import { Component, OnInit } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import {FormControl, FormGroup} from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import {Observable, of} from 'rxjs';
import {Store, select} from '@ngrx/store';

import {AgentService} from '../../services/agent.service';
import {ClientService} from '../../services/client.service';
import {ContractTypesService} from '../../services/contract-types.service';
import {FileExportService} from '../../services/file-export.service';
import {FreelancerService} from '../../services/freelancer.service';
import {JobService} from '../../services/job.service';
import { MY_FORMATS } from '../../model/date-format.model';
import {OptionVM} from '../../model/option.model';
import {ProjectService} from '../../services/project.service';
import {Router} from '@angular/router';
import {ShortlistVM} from '../../model/job.model';
import {SiteService} from '../../services/site.service';
import {TranslateService} from '../../services/translate.service';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-shortlistoffer-list',
  templateUrl: './shortlistoffer-list.component.html',
  styleUrls: ['./shortlistoffer-list.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class ShortlistofferListComponent implements OnInit {
  displayedAdminColumns = [
    'jobTitle',
    'sitePlace',
    'appointedAt',
    'freelancerName',
    'expiredAt',
    'action'
  ];
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
    search: new FormControl()
  });
  shortlistOffer: OptionVM[] = [];
  searchModel$: Observable<ShortlistVM | undefined> = of({});
  searchModel: any = {};
  componentActive = true;
  agentLK: OptionVM[] = [];
  clientLK: OptionVM[] = [];
  // @ts-ignore
  stateLK: OptionVM[] = [];
  projectLK: OptionVM[] = [];
  contractTypeLK: OptionVM[] = [];
  jobLK: OptionVM[] = [];
  siteLK: OptionVM[] = [];
  freelancerLK: OptionVM[] = [];
  paginator: any;

  constructor(
    private store: Store<fromJob.State>,
    private agentService: AgentService,
    private translateService: TranslateService,
    private contractTypesService: ContractTypesService,
    private jobService: JobService,
    private clientService: ClientService,
    private projectService: ProjectService,
    private fileExportService: FileExportService,
    private freelancerService: FreelancerService,
    private siteService: SiteService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadLookUps();
    this.searchModel$.subscribe((res: any) => {
      if (res && res.length) {
        this.searchModel = res;
        if (
          res.agent ||
          res.client ||
          res.project ||
          res.site ||
          res.contractType ||
          res.start ||
          res.end ||
          res.job ||
          res.freelancer ||
          res.status ||
          (res.search?.length && res.search?.length > 2)
        ) {
          this.store.dispatch(
            new fromJobAction.LoadShortlistOffer( this.searchModel )
          );
        }
      } else {
        this.searchModel = JSON.parse( localStorage.getItem('job.search') as string);
        if (this.searchModel) {
          this.offers.patchValue({
            agent: this.searchModel.agent,
            client: this.searchModel.client,
            project: this.searchModel.project,
            site: this.searchModel.site,
            contractType: this.searchModel.contractType,
            start: this.searchModel.start,
            end: this.searchModel.end,
            job: this.searchModel.job,
            freelancer: this.searchModel.freelancer,
            search: this.searchModel.search
          });
        }
        this.store.dispatch(
          new fromJobAction.LoadShortlistOffer(this.searchModel)
        );
      }
    });
    this.store.select(fromJob.getShortlistOffer).subscribe((res: any) => {
      this.shortlistOffer = this.sortOption(
        res?.data
          ? res?.data?.map((a: any) => {
            return {
              id: a?.id,
              freelancer_id: a?.freelancer_id,
              job: a?.job_title,
              site_place: a?.job_location,
              appointed_at: a?.appointed_at,
              freelancer_name: a?.freelancer_fullname,
              expired_at: a?.expired_at,
            };
          })
          : []
      );
      this.paginator = res?.meta?.pagination;
    });
    this.offers.get('agent')?.valueChanges.subscribe((data) => {
      this.searchModel = { ...this.searchModel, pageIndex: 1, agent: data };
      this.store.dispatch(new fromJobAction.LoadShortlistOffer(this.searchModel));
    });
    this.offers.get('client')?.valueChanges.subscribe((result) => {
      this.searchModel = { ...this.searchModel, pageIndex: 1, client: result };
      this.store.dispatch(new fromJobAction.LoadShortlistOffer(this.searchModel));
    });
    this.offers.get('contractType')?.valueChanges.subscribe((list) => {
      this.searchModel = {
        ...this.searchModel,
        pageIndex: 1,
        contractType: list,
      };
      this.store.dispatch(new fromJobAction.LoadShortlistOffer(this.searchModel));
    });
    this.offers.get('project')?.valueChanges.subscribe((outcome) => {
      this.searchModel = {
        ...this.searchModel,
        pageIndex: 1,
        project: outcome,
      };
      this.store.dispatch(new fromJobAction.LoadShortlistOffer(this.searchModel));
    });
    this.offers.get('site')?.valueChanges.subscribe((res) => {
      this.searchModel = { ...this.searchModel, pageIndex: 1, site: res };
      this.store.dispatch(new fromJobAction.LoadShortlistOffer(this.searchModel));
    });
    this.offers.get('job')?.valueChanges.subscribe((j) => {
      this.searchModel = { ...this.searchModel, pageIndex: 1, job: j };
      this.store.dispatch(new fromJobAction.LoadShortlistOffer(this.searchModel));
    });
    this.offers.get('freelancer')?.valueChanges.subscribe((f) => {
      this.searchModel = { ...this.searchModel, pageIndex: 1, freelancer: f };
      this.store.dispatch(new fromJobAction.LoadShortlistOffer(this.searchModel));
    });
    this.offers.get('start')?.valueChanges.subscribe((s) => {
      if (s) {
        this.searchModel = {
          ...this.searchModel,
          pageIndex: 1,
          date_from: undefined,
        };
        this.store.dispatch(new fromJobAction.LoadShortlistOffer(this.searchModel));
      }
    });
    this.offers.get('end')?.valueChanges.subscribe((e) => {
      if (e) {
        this.searchModel = {
          ...this.searchModel,
          pageIndex: 1,
          date_to: undefined,
        };
        this.store.dispatch(new fromJobAction.LoadShortlistOffer(this.searchModel));
      }
    });
    this.offers.get('search')?.valueChanges.subscribe((s) => {
      if (s.length > 2) {
        this.searchModel = {
          ...this.searchModel,
          pageIndex: 1,
          search: s,
        };
        this.store.dispatch(new fromJobAction.LoadShortlistOffer(this.searchModel));
      }
      else if (s.length === 0 ) {
        this.searchModel = {
          ...this.searchModel,
          pageIndex: 1,
          search: s,
        };
        this.store.dispatch(new fromJobAction.LoadShortlistOffer(this.searchModel));
      }
    });
    this.searchModel$ = this.store.pipe(
      select(fromJob.getSearchModel),
      takeWhile(() => this.componentActive)
    );
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
  }

  download() {
    const fieldNames = Object.keys(this.shortlistOffer[0]).map((a) =>
      this.translateService.instant('jobs.shortlist.download.' + a)
    );
    this.fileExportService.downloadCSV({ data: this.shortlistOffer, filePrefix: 'Shortlist', headerFields: fieldNames });
  }


  sortOption(options: OptionVM[]) {
    return options.sort((a: OptionVM, b: OptionVM) =>
      a.text && b.text ? (a.text > b.text ? 1 : b.text > a.text ? -1 : 0) : 0
    );
  }

  navigateToDetail(row: any) {
    this.router.navigate(['jobs/shortlist', row.id]);
  }
}
