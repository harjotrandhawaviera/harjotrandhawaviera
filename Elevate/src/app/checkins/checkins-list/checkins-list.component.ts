import * as fromCheckins from '../state/index';
import * as fromCheckinsAction from '../state/checkins.actions';
import * as fromUser from './../../root-state/user-state';
import * as moment from 'moment';

import { AssignmentVM, CheckinsSearchVM } from '../../model/assignment.model';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { AllowedActions } from '../../constant/allowed-actions.constant';
import { AssignmentMappingService } from '../../services/mapping-services/assignment-mapping.service';
import { AssignmentService } from '../../services/assignment.service';
import { CheckinVM } from '../../model/checkin.model';
import { ConfirmBoxComponent } from '../../core/confirm-box/confirm-box.component';
import { FileExportService } from '../../services/file-export.service';
import { FormatConfig } from '../../constant/formats.constant';
import { FreelancerService } from '../../services/freelancer.service';
import { MatDialog } from '@angular/material/dialog';
import { OptionVM } from '../../model/option.model';
import { PrepareService } from '../../services/prepare.service';
import { ProjectService } from '../../services/project.service';
import { ReasonBoxComponent } from '../../core/reason-box/reason-box.component';
import { Router } from '@angular/router';
import { SiteService } from '../../services/site.service';
import { StorageService } from '../../services/storage.service';
import { TranslateService } from '../../services/translate.service';
import { UserVM } from '../../model/user.model';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-checkins-list',
  templateUrl: './checkins-list.component.html',
  styleUrls: ['./checkins-list.component.scss'],
})
export class CheckinsListComponent implements OnInit {
  componentActive = true;

  projectLK: OptionVM[] = [];
  siteLK: OptionVM[] = [];
  freelancerLK: OptionVM[] = [];

  searchModel$: Observable<CheckinsSearchVM | undefined> = of({});
  searchModel: CheckinsSearchVM = {};
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

  displayedColumns = [
    'jobTitle',
    'freelancerName',
    'siteCity',
    'startDateTime',
    'action',
  ];

  searchForm = new FormGroup({
    project: new FormControl(''),
    site: new FormControl(''),
    freelancer: new FormControl(''),
    search: new FormControl(''),
  });

  @HostListener('window:beforeunload', ['$event'])
  clearLocalStorage() {
    localStorage.removeItem('checkin.search');
  }
  constructor(
    private fileExportService: FileExportService,
    private store: Store<fromCheckins.State>,
    private userStore: Store<fromUser.State>,
    private projectService: ProjectService,
    private siteService: SiteService,
    private assignmentService: AssignmentService,
    private freelancerService: FreelancerService,
    private assignmentMappingService: AssignmentMappingService,
    private prepareService: PrepareService,
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
      select(fromCheckins.getLoading),
      takeWhile(() => this.componentActive)
    );
    this.result$ = this.store.pipe(
      select(fromCheckins.getSearchResult),
      takeWhile(() => this.componentActive)
    );
    this.meta$ = this.store.pipe(
      select(fromCheckins.getMetaData),
      takeWhile(() => this.componentActive)
    );
    this.noRecords$ = this.store.pipe(
      select(fromCheckins.getNoRecords),
      takeWhile(() => this.componentActive)
    );
    this.currentPage$ = this.store.pipe(
      select(fromCheckins.getCurrentIndex),
      takeWhile(() => this.componentActive)
    );
    this.totalRecords$ = this.store.pipe(
      select(fromCheckins.getTotalRecord),
      takeWhile(() => this.componentActive)
    );
    this.pageSize$ = this.store.pipe(
      select(fromCheckins.getPageSize),
      takeWhile(() => this.componentActive)
    );
    this.searchModel$ = this.store.pipe(
      select(fromCheckins.getSearchModel),
      takeWhile(() => this.componentActive)
    );

    this.getListFromSearchModel();
    this.getUpdatedFormValues();
  }

  getSelectedFilters() {
    const previous = this.storageService.get('checkin.search');
    if (previous !== null) {
      const { project, site, freelancer, search } = JSON.parse(
        previous
      ) as CheckinsSearchVM;
      this.searchForm.patchValue({
        project: project,
        site: site,
        freelancer: freelancer,
        search: search,
      });
    } else {
      const searchModel: CheckinsSearchVM = {
        pageIndex: 1,
        pageSize: 50,
        sortBy: 'appointed_at',
        sortDir: 'asc',
      };
      this.store.dispatch(new fromCheckinsAction.UpdateSearch(searchModel));
    }
  }

  loadLookUps() {
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
          res.project ||
          res.site ||
          res.freelancer ||
          (res.search?.length && res.search?.length > 2)
        ) {
          this.store.dispatch(
            new fromCheckinsAction.LoadCheckinsList({
              search: this.searchModel,
            })
          );
        } else {
          this.store.dispatch(
            new fromCheckinsAction.LoadCheckinsList({
              search: this.searchModel,
            })
          );
        }
      } else {
        const searchModel: CheckinsSearchVM = {
          pageIndex: 1,
          pageSize: 50,
          sortBy: 'appointed_at',
          sortDir: 'asc',
        };
        this.store.dispatch(new fromCheckinsAction.UpdateSearch(searchModel));
      }
    });
  }

  getUpdatedFormValues() {
    this.searchForm.get('project')?.valueChanges.subscribe((res) => {
      if (res) {
        const update = { ...this.searchModel, pageIndex: 1, project: res };
        this.store.dispatch(new fromCheckinsAction.UpdateSearch(update));
      } else {
        const update = {
          ...this.searchModel,
          pageIndex: 1,
          project: undefined,
        };
        this.store.dispatch(new fromCheckinsAction.UpdateSearch(update));
      }
    });
    this.searchForm.get('site')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, site: res };
      this.store.dispatch(new fromCheckinsAction.UpdateSearch(update));
    });
    this.searchForm.get('freelancer')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, freelancer: res };
      this.store.dispatch(new fromCheckinsAction.UpdateSearch(update));
    });
    this.searchForm.get('search')?.valueChanges.subscribe((res) => {
      if ((res && res.length > 2) || !res) {
        const update = { ...this.searchModel, pageIndex: 1, search: res };
        this.store.dispatch(new fromCheckinsAction.UpdateSearch(update));
      }
    });
  }

  pageChange(event: any) {
    const update = {
      ...this.searchModel,
      pageSize: event.pageSize,
      pageIndex: event.pageIndex + 1,
    };
    this.store.dispatch(new fromCheckinsAction.UpdateSearch(update));
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
          project: this.searchModel.project ? this.searchModel.project : undefined,
          site: this.searchModel.site ? this.searchModel.site : undefined,
          freelancer: this.searchModel.freelancer ? this.searchModel.freelancer : undefined,
          without_checkins: true,
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
          fileName: `_checkins`,
          mimeType: 'text/csv;charset=UTF-8',
        });
      }
    });
  }
}
