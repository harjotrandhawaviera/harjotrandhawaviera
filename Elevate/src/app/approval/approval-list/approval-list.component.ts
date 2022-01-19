import * as fromApproval from './../state';
import * as fromApprovalAction from './../state/approval.actions';

import { ActivatedRoute, Router } from '@angular/router';
import { ApprovalRequestExportVM, ApprovalRequestSearchVM, ApprovalRequestVM } from './../../model/approval-request.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { take, takeWhile } from 'rxjs/operators';

import { ApprovalRequestMappingService } from './../../services/mapping-services/apparoval-request-mapping.service';
import { ApprovalRequestService } from '../../services/approval-request.service';
import { FileExportService } from './../../services/file-export.service';
import { FormatService } from './../../services/format.service';
import { TranslateService } from '../../services/translate.service';
import {FormControl, FormGroup} from '@angular/forms';
import {OptionVM} from '../../model/option.model';
import {ContractTypesService} from '../../services/contract-types.service';

@Component({
  selector: 'app-approval-list',
  templateUrl: './approval-list.component.html',
  styleUrls: ['./approval-list.component.scss']
})
export class ApprovalListComponent implements OnInit, OnDestroy {
  type = '';
  result$: Observable<ApprovalRequestVM[]> = of([]);
  searchModel$: Observable<ApprovalRequestSearchVM | undefined> = of({});
  componentActive = true;
  searchModel: ApprovalRequestSearchVM = {};
  totalRecords$: Observable<number | undefined> = of(undefined);
  currentPage$: Observable<number | undefined> = of(undefined);
  pageSize$: Observable<number | undefined> = of(undefined);
  loading$: Observable<boolean> = of(false);
  noRecords$: Observable<boolean> = of(false);
  displayedColumns: string[] = [];
  contractTypeLK: OptionVM[] = [];
  Form = new FormGroup({
    contractType: new FormControl(''),
    postcodesMin: new FormControl(''),
    postcodesMax: new FormControl(''),
    search: new FormControl(''),
  });
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private translateService: TranslateService,
    private approvalRequestMappingService: ApprovalRequestMappingService,
    private approvalRequestService: ApprovalRequestService,
    private fileExportService: FileExportService,
    private contractTypesService: ContractTypesService,
    private formatService: FormatService,
    private store: Store<fromApproval.State>) {

  }

  ngOnInit(): void {
    this.retrieveIdFromParameters();
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
    this.searchModel.type = this.type;
    this.Form.get('contractType')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, contractType: res };
      this.store.dispatch(new fromApprovalAction.UpdateSearch(update));
    });
    this.Form.get('postcodesMin')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, postcodesMin: res };
      this.store.dispatch(new fromApprovalAction.UpdateSearch(update));
    });
    this.Form.get('postcodesMax')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, postcodesMax: res };
      this.store.dispatch(new fromApprovalAction.UpdateSearch(update));
    });
    this.Form.get('search')?.valueChanges.subscribe((res) => {
      if ((res && res.length > 2) || !res) {
        const update = { ...this.searchModel, pageIndex: 1, search: res };
        this.store.dispatch(new fromApprovalAction.UpdateSearch(update));
      }
    });

    this.loading$ = this.store.pipe(
      select(fromApproval.getLoading),
      takeWhile(() => this.componentActive)
    );
    this.result$ = this.store.pipe(
      select(fromApproval.getSearchResult),
      takeWhile(() => this.componentActive)
    );
    this.noRecords$ = this.store.pipe(
      select(fromApproval.getNoRecords),
      takeWhile(() => this.componentActive)
    );

    this.currentPage$ = this.store.pipe(
      select(fromApproval.getCurrentIndex),
      takeWhile(() => this.componentActive)
    );
    this.totalRecords$ = this.store.pipe(
      select(fromApproval.getTotalRecord),
      takeWhile(() => this.componentActive)
    );
    this.pageSize$ = this.store.pipe(
      select(fromApproval.getPageSize),
      takeWhile(() => this.componentActive)
    );
    this.searchModel$ = this.store.pipe(
      select(fromApproval.getSearchModel),
      takeWhile(() => this.componentActive)
    );
    this.subscribeSearch();
    this.patchData();
  }
  subscribeSearch() {
    this.searchModel$.subscribe((res) => {
      if (res && JSON.stringify({}) !== JSON.stringify(res)) {
        this.searchModel = res;
        this.store.dispatch(
          new fromApprovalAction.LoadApprovalList(this.searchModel)
        );
      }
    });
  }
  retrieveIdFromParameters() {
    this.route.params.subscribe(res => {
      this.type = res.type;
      this.displayedColumns = [
        'fullname',
        'email',
        'mobile',
        'city',
        'postcode',
        'submissionDate',
        'status',
        'action'];
    });

  }

  patchData() {
    this.Form.patchValue({
      contractType: this.searchModel.contractType,
      postcodesMin: this.searchModel.postcodesMin,
      postcodesMax: this.searchModel.postcodesMax,
      search: this.searchModel.search
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
    this.store.dispatch(new fromApprovalAction.UpdateSearch(update));
  }
  download() {
    this.searchModel$.pipe(take(1)).subscribe((model) => {
      if (model) {
        const searchModel = this.approvalRequestMappingService.searchRequest(model);
        this.approvalRequestService
          .getApprovalRequests({
            include: searchModel.include,
            filters: searchModel.filters,
          })
          .subscribe((res) => {
            const {
              list,
            } = this.approvalRequestMappingService.approvalRequestMultipleResponseToVM(res);
            const exportList: ApprovalRequestExportVM[] = [];
            if (list && list.length > 0) {
              list.forEach((approval) => {
                if (this.type === 'freelancer-onboarding') {
                  const obj: ApprovalRequestExportVM = {
                    fullname: approval.fullname || '',
                    email: approval.user.email || '',
                    mobile: approval.profile.mobile || '',
                    city: approval.profile.city || '',
                    postcode: approval.zip || '',
                    submissionDate: this.formatService.date(approval.created_at, true),
                    status: approval.user.status || ' ',
                  };
                  exportList.push(obj);
                } else {
                  const obj: ApprovalRequestExportVM = {
                    fullname: approval.fullname || '',
                    email: approval.user.email || '',
                    mobile: approval.mobile || '',
                    city: approval.profile.city || '',
                    actionType: approval.action ? this.translateService.instant('approval.action-type.' + approval.action) : '',
                    submissionDate: this.formatService.date(approval.created_at, true),
                    status: approval.user.status || '',
                  };
                  exportList.push(obj);
                }
              });
              const fieldNames = Object.keys(exportList[0]).map((a) =>
                this.translateService.instant('approval.list.' + a)
              );
              this.fileExportService.downloadCSV({
                headerFields: fieldNames,
                data: exportList,
                filePrefix: 'approval_list_table',
              });
            }
          });
      }
    });
  }
  navigateToDetail(data: ApprovalRequestVM) {
    if (this.type === 'freelancer-onboarding') {
      this.router.navigate(['/approval/freelancer-onboarding/' + data.id]);
    } else {
      this.router.navigate(['/approval/freelancer-changerequest/' + data.id + '/change']);
    }
  }
  ngOnDestroy(): void {
    this.componentActive = false;
  }
}
