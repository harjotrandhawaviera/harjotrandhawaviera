import * as fromCertificate from './../state';
import * as fromCertificateAction from './../state/certificates.actions';
import * as fromUser from './../../root-state/user-state';

import { ActivatedRoute, Router } from '@angular/router';
import {
  CertificateSearchVM,
  CertificateVM
} from '../../model/certificate.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { CertificateMappingService } from './../../services/mapping-services/certificate-mapping.service';
import { CertificateService } from './../../services/certificate.service';
import { ContractTypesService } from '../../services/contract-types.service';
import { FileExportService } from '../../services/file-export.service';
import { FormConfig } from '../../constant/forms.constant';
import { FormatService } from '../../services/format.service';
import { MatDialog } from '@angular/material/dialog';
import { OptionVM } from '../../model/option.model';
import { StorageService } from '../../services/storage.service';
import { TranslateService } from '../../services/translate.service';
import { UserService } from './../../services/user.service';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-certificate-list',
  templateUrl: './certificate-list.component.html',
  styleUrls: ['./certificate-list.component.scss'],
})
export class CertificateListComponent implements OnInit, OnDestroy {
  searchForm = new FormGroup({
    recommendation: new FormControl([], []),
    category: new FormControl('', []),
    search: new FormControl('', []),
  });
  result$: Observable<CertificateVM[]> = of([]);
  searchModel$: Observable<CertificateSearchVM | undefined> = of({});
  componentActive = true;
  searchModel: CertificateSearchVM = {};
  totalRecords$: Observable<number | undefined> = of(undefined);
  currentPage$: Observable<number | undefined> = of(undefined);
  pageSize$: Observable<number | undefined> = of(undefined);
  loading$: Observable<boolean> = of(false);
  noRecords$: Observable<boolean> = of(false);

  recommendationLK: OptionVM[] = [];
  categoriesLK: OptionVM[] = [];
  type: string = '';
  // deletePermission$: Observable<boolean> = of(false);
  constructor(
    private fileExportService: FileExportService,
    private storageService: StorageService,
    private translateService: TranslateService,
    private certificateMappingService: CertificateMappingService,
    private certificateService: CertificateService,
    private userStore: Store<fromUser.State>,
    private contractTypesService: ContractTypesService,
    private router: Router,
    private userService: UserService,
    public dialog: MatDialog,
    public activatedRoute: ActivatedRoute,
    private formatService: FormatService,
    private store: Store<fromCertificate.State>
  ) { }

  ngOnInit(): void {
    this.loadLookups();
    this.loading$ = this.store.pipe(
      select(fromCertificate.getLoading),
      takeWhile(() => this.componentActive)
    );

    this.result$ = this.store.pipe(
      select(fromCertificate.getSearchResult),
      takeWhile(() => this.componentActive)
    );
    this.noRecords$ = this.store.pipe(
      select(fromCertificate.getNoRecords),
      takeWhile(() => this.componentActive)
    );

    this.currentPage$ = this.store.pipe(
      select(fromCertificate.getCurrentIndex),
      takeWhile(() => this.componentActive)
    );
    this.totalRecords$ = this.store.pipe(
      select(fromCertificate.getTotalRecord),
      takeWhile(() => this.componentActive)
    );
    this.pageSize$ = this.store.pipe(
      select(fromCertificate.getPageSize),
      takeWhile(() => this.componentActive)
    );
    this.searchModel$ = this.store.pipe(
      select(fromCertificate.getSearchModel),
      takeWhile(() => this.componentActive)
    );
    this.activatedRoute.data.subscribe(res => {
      if (res.type) {
        this.type = res.type;
        this.subscribeSearch();
      }
    });
  }
  subscribeSearch() {
    this.activatedRoute.data.subscribe(res => {
      if (res.type) {
        this.type = res.type;
        const searchModel: CertificateSearchVM = {
          pageIndex: 1,
          pageSize: 6,
          type: res.type
        };
        this.store.dispatch(new fromCertificateAction.UpdateSearch(searchModel));
      }
    });
    this.searchModel$.subscribe((res) => {
      if (res && JSON.stringify(res) !== JSON.stringify({})) {
        this.searchModel = res;
        this.store.dispatch(
          new fromCertificateAction.LoadCertificateList({...this.searchModel, type: this.type})
        );
      }
    });
    this.searchForm.get('recommendation')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, recommendation: res };
      this.store.dispatch(new fromCertificateAction.UpdateSearch(update));
    });
    this.searchForm.get('category')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, category: res };
      this.store.dispatch(new fromCertificateAction.UpdateSearch(update));
    });
    this.searchForm.get('search')?.valueChanges.subscribe((res) => {
      if ((res && res.length > 2) || !res) {
        const update = { ...this.searchModel, pageIndex: 1, search: res };
        this.store.dispatch(new fromCertificateAction.UpdateSearch(update));
      }
    });
  }
  loadLookups() {
    this.recommendationLK = FormConfig.certificates.recommendation.map(a => {
      return {
        value: a,
        text: a
      }
    });
    this.categoriesLK = FormConfig.certificates.categories.map(a => {
      return {
        value: a,
        text: a
      }
    });
  }
  pageChange(event: any) {
    const update = {
      ...this.searchModel,
      pageSize: event.pageSize,
      pageIndex: event.pageIndex + 1,
    };
    this.store.dispatch(new fromCertificateAction.UpdateSearch(update));
  }
  sortOption(options: OptionVM[]) {
    return options.sort((a: OptionVM, b: OptionVM) =>
      a.text && b.text ? (a.text > b.text ? 1 : b.text > a.text ? -1 : 0) : 0
    );
  }
  ngOnDestroy(): void {
    this.componentActive = false;
  }
}
