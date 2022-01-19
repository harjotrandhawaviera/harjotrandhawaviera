import * as fromFreelancer from './../state';
import * as fromFreelancerAction from './../state/freelancer.actions';
import * as fromUser from './../../root-state/user-state';

import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  FreelancerExportVM,
  FreelancerSearchVM,
  FreelancerVM,
} from '../../model/freelancer.model';
import { Observable, of } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { take, takeWhile } from 'rxjs/operators';

import { AllowedActions } from '../../constant/allowed-actions.constant';
import { CertificateMappingService } from './../../services/mapping-services/certificate-mapping.service';
import { CertificateService } from './../../services/certificate.service';
import { ConfirmBoxComponent } from '../../core/confirm-box/confirm-box.component';
import { ContractTypesService } from '../../services/contract-types.service';
import { FileExportService } from '../../services/file-export.service';
import { FormConfig } from '../../constant/forms.constant';
import { FormatService } from '../../services/format.service';
import { FreelancerMappingService } from '../../services/mapping-services';
import {FreelancerPopupComponent} from '../freelancer-popup/freelancer-popup.component';
import { FreelancerService } from '../../services/freelancer.service';
import { MatDialog } from '@angular/material/dialog';
import { OptionVM } from '../../model/option.model';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { TranslateService } from '../../services/translate.service';

@Component({
  selector: 'app-freelancer-list',
  templateUrl: './freelancer-list.component.html',
  styleUrls: ['./freelancer-list.component.scss'],
})
export class FreelancerListComponent implements OnInit, OnDestroy {
  searchForm = new FormGroup({
    contractType: new FormControl(''),
    postcodesMin: new FormControl(''),
    postcodesMax: new FormControl(''),
    status: new FormControl([]),
    certificates: new FormControl([]),
    assignment_rating: new FormControl([]),
    freelancer_rating: new FormControl([]),
    search: new FormControl(''),
  });
  result$: Observable<FreelancerVM[]> = of([]);
  searchModel$: Observable<FreelancerSearchVM | undefined> = of({});
  componentActive = true;
  searchModel: FreelancerSearchVM = {};
  totalRecords$: Observable<number | undefined> = of(undefined);
  currentPage$: Observable<number | undefined> = of(undefined);
  pageSize$: Observable<number | undefined> = of(undefined);
  loading$: Observable<boolean> = of(false);
  noRecords$: Observable<boolean> = of(false);
  displayedColumns = [
    'Name',
    'E-Mail',
    'Mobile',
    'City',
    'Post Code',
    'Receipt Date',
    'Status',
    'action'
  ];
  contractTypeLK: OptionVM[] = [];
  stateLK: OptionVM[] = [];
  certificateLK: OptionVM[] = [];
  deletePermission$: Observable<boolean> = of(false);
  viewing: any ='Tile';
  @HostListener('window:beforeunload', ['$event'])
  clearLocalStorage() {
    localStorage.removeItem('freelancer.search');
  }
  constructor(
    private fileExportService: FileExportService,
    private storageService: StorageService,
    private translateService: TranslateService,
    private freelancerMappingService: FreelancerMappingService,
    private freelancerService: FreelancerService,
    private userStore: Store<fromUser.State>,
    private contractTypesService: ContractTypesService,
    private certificateService: CertificateService,
    private certificateMappingService: CertificateMappingService,
    private router: Router,
    public dialog: MatDialog,
    private formatService: FormatService,
    private store: Store<fromFreelancer.State>
  ) { }

  ngOnInit(): void {
    if(localStorage.getItem('viewing') != null){
      this.viewing = localStorage.getItem('viewing');
      localStorage.removeItem('viewing');
    }
    const previous = this.storageService.get('freelancer.search');
    if (previous !== null) {
      const { search,
        contractType,
        postcodesMin,
        postcodesMax,
        status,
        certificates,
        assignment_rating,
        freelancer_rating } = JSON.parse(
          previous
        ) as FreelancerSearchVM;
      this.searchForm.patchValue({
        search: search,
        contractType: contractType,
        postcodesMin: postcodesMin,
        postcodesMax: postcodesMax,
        status: status,
        certificates: certificates,
        assignment_rating: assignment_rating,
        freelancer_rating: freelancer_rating
      });
    } else {
      const searchModel: FreelancerSearchVM = {
        pageIndex: 1,
        pageSize: 12,
      };
      this.store.dispatch(new fromFreelancerAction.UpdateSearch(searchModel));
    }
    this.loadLookups();
    this.loading$ = this.store.pipe(
      select(fromFreelancer.getLoading),
      takeWhile(() => this.componentActive)
    );
    this.deletePermission$ = this.userStore.pipe(
      select(fromUser.isAllowed, {
        permissions: AllowedActions['delete-users'],
      }),
      takeWhile(() => this.componentActive)
    );
    this.result$ = this.store.pipe(
      select(fromFreelancer.getSearchResult),
      takeWhile(() => this.componentActive)
    );
    this.noRecords$ = this.store.pipe(
      select(fromFreelancer.getNoRecords),
      takeWhile(() => this.componentActive)
    );

    this.currentPage$ = this.store.pipe(
      select(fromFreelancer.getCurrentIndex),
      takeWhile(() => this.componentActive)
    );
    this.totalRecords$ = this.store.pipe(
      select(fromFreelancer.getTotalRecord),
      takeWhile(() => this.componentActive)
    );
    this.pageSize$ = this.store.pipe(
      select(fromFreelancer.getPageSize),
      takeWhile(() => this.componentActive)
    );
    this.searchModel$ = this.store.pipe(
      select(fromFreelancer.getSearchModel),
      takeWhile(() => this.componentActive)
    );
    this.subscribeSearch();
  }
  subscribeSearch() {
    // this.searchModel$.pipe(take(1)).subscribe((model) => {
    //   if (model) {
    //     this.searchForm.patchValue({
    //       search: model.search,
    //       contractType: model.contractType,
    //       postcodesMin: model.postcodesMin,
    //       postcodesMax: model.postcodesMax,
    //       status: model.status,
    //       certificates: model.certificates,
    //       assignment_rating: model.assignment_rating,
    //       freelancer_rating: model.freelancer_rating
    //     });
    //   }
    // });
    this.searchModel$.subscribe((res) => {
      if (res) {
        this.searchModel = res;
        this.store.dispatch(
          new fromFreelancerAction.LoadFreelancerList(this.searchModel)
        );
      } else {
        const searchModel: FreelancerSearchVM = {
          pageIndex: 1,
          pageSize: 6,
        };
        this.store.dispatch(new fromFreelancerAction.UpdateSearch(searchModel));
      }
    });
    this.searchForm.get('contractType')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, contractType: res };
      this.store.dispatch(new fromFreelancerAction.UpdateSearch(update));
    });
    this.searchForm.get('status')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, status: res };
      this.store.dispatch(new fromFreelancerAction.UpdateSearch(update));
    });
    this.searchForm.get('certificates')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, certificates: res };
      this.store.dispatch(new fromFreelancerAction.UpdateSearch(update));
    });
    this.searchForm.get('postcodesMin')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, postcodesMin: res };
      this.store.dispatch(new fromFreelancerAction.UpdateSearch(update));
    });
    this.searchForm.get('postcodesMax')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, postcodesMax: res };
      this.store.dispatch(new fromFreelancerAction.UpdateSearch(update));
    });
    this.searchForm.get('assignment_rating')?.valueChanges.subscribe((res) => {
      const update = {
        ...this.searchModel,
        pageIndex: 1,
        assignment_rating: res,
      };
      this.store.dispatch(new fromFreelancerAction.UpdateSearch(update));
    });
    this.searchForm.get('search')?.valueChanges.subscribe((res) => {
      if ((res && res.length > 2) || !res) {
        const update = { ...this.searchModel, pageIndex: 1, search: res };
        this.store.dispatch(new fromFreelancerAction.UpdateSearch(update));
      }
    });
  }
  loadLookups() {
    this.translateService
      .get('administration.freelancers.fields.statuses')
      .subscribe((a) => {
        this.stateLK = FormConfig.freelancers.statuses.map((a) => {
          return {
            value: a,
            text: this.translateService.instant(
              'administration.freelancers.fields.statuses.' + a
            ),
          };
        });
      });
    this.contractTypesService.getContractTypeLK().subscribe((res) => {
      this.translateService.get('contracts.identifier.freelancer').subscribe(() => {
        this.contractTypeLK = this.sortOption(
          res.data
            ? res.data.map((a) => {
              return {
                value: a.id,
                text: a.id === 1 ? this.translateService.instant('contracts.identifier.freelancer') :
                  this.translateService.instant('contracts.identifier.tax_card')
              };
            })
            : []
        );
      });
    });

    this.certificateService
      .getCertificate({
        limit: 100000,
        order_by: 'name',
        only_fields: [
          'certificate.id',
          'certificate.name',
          'certificate.is_exclusive',
          'certificate.description',
          'certificate.teaser',
        ],
        filters: [{ key: 'only_enabled', value: true }],
      })
      .subscribe((res) => {
        const certificate = this.certificateMappingService.certificateMultipleResponseToVM(
          res
        );
        this.certificateLK = this.sortOption(
          (certificate && certificate.list ? certificate.list : []).map((a) => {
            return {
              value: a.id,
              text: a.name,
              info: a.description ? a.description.substring(0, 60) + '...' : '',
            };
          })
        );
      });
  }
  pageChange(event: any) {
    const update = {
      ...this.searchModel,
      pageSize: event.pageSize,
      pageIndex: event.pageIndex + 1,
    };
    this.store.dispatch(new fromFreelancerAction.UpdateSearch(update));
  }

  download() {
    this.searchModel$.pipe(take(1)).subscribe((model) => {
      if (model) {
        const searchModel = this.freelancerMappingService.searchRequest(model);
        this.freelancerService
          .getFreelancers({
            include: searchModel.include,
            filters: searchModel.filters,
          })
          .subscribe((res) => {
            const {
              list,
            } = this.freelancerMappingService.freelancerSearchResponseToVM(res);
            const exportList: FreelancerExportVM[] = [];
            if (list && list.length > 0) {
              list.forEach((freelancer) => {
                const user = freelancer.user ? freelancer.user : {};
                exportList.push({
                  id: freelancer.id ? freelancer.id.toString() : '',
                  firstname: freelancer.firstname || '',
                  lastname: freelancer.lastname || '',
                  fullname: freelancer.fullname || '',
                  gender: freelancer.gender || '',
                  birthdate: freelancer.birthdate || '',
                  email: user.email || '',
                  mobile: freelancer.mobile || '',
                  alternative_phone: freelancer.alternative_phone || '',
                  city: freelancer.city || '',
                  zip: freelancer.zip || '',
                  address: freelancer.address || '',
                  profession: freelancer.profession || '',
                  haircolor: freelancer.haircolor || '',
                  pants: freelancer.pants || '',
                  shoesize: freelancer.shoesize ? freelancer.shoesize.toString() : '',
                  chest: freelancer.chest ? freelancer.chest.toString() : '',
                  height: freelancer.height ? freelancer.height.toString() : '',
                  hip: freelancer.hip ? freelancer.hip.toString() : '',
                  waist: freelancer.waist ? freelancer.waist.toString() : '',
                  shirtsize: freelancer.shirtsize || '',
                  stateName: this.translateService.instant('administration.users.state.' + user.status),
                });
              });
              const fieldNames = Object.keys(exportList[0]).map((a) =>
                this.translateService.instant('administration.freelancers.table.' + a)
              );
              this.fileExportService.downloadCSV({
                headerFields: fieldNames,
                data: exportList,
                filePrefix: 'administration_freelancers_table',
              });
            }
          });
      }
    });
  }
  searchChange() { }
  deleteRecord(freelancer: FreelancerVM) {
    if (freelancer.id) {
      const dialogRef = this.dialog.open(ConfirmBoxComponent, {
        data: {
          type: 'warning',
          title: this.translateService.instant(
            'administration.freelancers.table.remove.title'
          ),
          message: this.translateService.instant(
            'administration.freelancers.table.remove.message'
          ),
          cancelCode: 'common.buttons.cancel',
          confirmCode: 'common.buttons.yes-remove',
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          // if (freelancer.user && freelancer.user.status === 'onboarding') {
          //   this.store.dispatch(new fromFreelancerAction.DeleteFreelancer(freelancer.id));
          //   return;
          // }
          if (freelancer.user?.id) {
            this.store.dispatch(new fromFreelancerAction.DeleteFreelancer(freelancer.user.id));
          }
        }
      });
    }
  }
  sortOption(options: OptionVM[]) {
    return options.sort((a: OptionVM, b: OptionVM) =>
      a.text && b.text ? (a.text > b.text ? 1 : b.text > a.text ? -1 : 0) : 0
    );
  }
  clearAssignmentRating() {
    this.searchForm.get('assignment_rating')?.patchValue(null);
  }
  ngOnDestroy(): void {
    this.componentActive = false;
  }
  gotoDetail(row: any) {
    if (row && row.user) {
      if (row.user && row.user.status === 'onboarding') {
        // $state.go('^.profile', {freelancerId: item.id});
        this.router.navigate(['/administration/freelancers/profile', row.id]);
        return;
      }
      this.router.navigate(['/administration/freelancers', row.user.id]);
    }
  }
  openpopuup(row:any) {
    localStorage.setItem('viewing', this.viewing);
    if (row && row.user) {
      if (row.user && (row.user.status === 'onboarding' || row.user.status === 'active')) {
        // this.router.navigate(['/administration/freelancers/profile', row.id]);
        this.dialog.open(FreelancerPopupComponent, {
          width: 'auto',
          data: {
            id: row.id,
          },
          disableClose: true,
          hasBackdrop: false
        });
      }
      else{
        this.dialog.open(FreelancerPopupComponent, {
          data: {
            id: row.id
          },
          disableClose: true,
          hasBackdrop: false
        });
      }
    }

  }
}
