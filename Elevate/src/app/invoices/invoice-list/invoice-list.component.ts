import * as fromInvoice from './../state';
import * as fromInvoiceAction from './../state/invoice.actions';
import * as fromUser from './../../root-state/user-state';

import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  InvoiceSearchVM,
  InvoiceVM
} from '../../model/invoice.model';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { Observable, of } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { take, takeWhile } from 'rxjs/operators';

import { ClientService } from './../../services/client.service';
import { ConfirmBoxComponent } from '../../core/confirm-box/confirm-box.component';
import { ContractTypesService } from '../../services/contract-types.service';
import { FileExportService } from '../../services/file-export.service';
import { FormConfig } from './../../constant/forms.constant';
import { FormatService } from '../../services/format.service';
import { FreelancerService } from './../../services/freelancer.service';
import { InvoiceMappingService } from './../../services/mapping-services/invoice-mapping.service';
import { InvoiceService } from './../../services/invoice.service';
import { JobService } from '../../services/job.service';
import { MY_FORMATS } from '../../model/date-format.model';
import { MatDialog } from '@angular/material/dialog';
import { OptionVM } from '../../model/option.model';
import { StorageService } from '../../services/storage.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '../../services/translate.service';
import { UserService } from './../../services/user.service';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class InvoiceListComponent implements OnInit {
  searchForm = new FormGroup({
    search: new FormControl(''),
    jobId: new FormControl(''),
    freelancerId: new FormControl(''),
    state: new FormControl(''),
    attributes: new FormControl(''),
    dateFrom: new FormControl(''),
    dateTo: new FormControl('')
  });
  result$: Observable<InvoiceVM[]> = of([]);
  searchModel$: Observable<InvoiceSearchVM | undefined> = of({});
  componentActive = true;
  searchModel: InvoiceSearchVM = {};
  totalRecords$: Observable<number | undefined> = of(undefined);
  currentPage$: Observable<number | undefined> = of(undefined);
  pageSize$: Observable<number | undefined> = of(undefined);
  loading$: Observable<boolean> = of(false);
  noRecords$: Observable<boolean> = of(false);
  jobList: OptionVM[] = [];
  freelancerList: OptionVM[] = [];
  canDelete = false;
  downloadColumns = ['clientName', 'name', 'value', 'available', 'planned', 'consumed', 'count_assignments', 'count_orders'];
  isFreelancer: boolean = false;
  attributesLK: OptionVM[] = [];
  stateLK: OptionVM[] = [];
  freelancerId: any;
  constructor(
    private fileExportService: FileExportService,
    private storageService: StorageService,
    private translateService: TranslateService,
    private invoiceMappingService: InvoiceMappingService,
    private invoiceService: InvoiceService,
    private toastrService: ToastrService,
    private jobService: JobService,
    private freelancerService: FreelancerService,
    private router: Router,
    private userService: UserService,
    public dialog: MatDialog,
    public activatedRoute: ActivatedRoute,
    private clientService: ClientService,
    private formatService: FormatService,
    private store: Store<fromInvoice.State>
  ) { }

  ngOnInit(): void {
    this.canDelete = this.userService.user().isAllowed('delete-invoices');
    const previous = this.storageService.get('invoice.search');
    this.isFreelancer = this.userService.user().role() === 'freelancer';
    if (this.isFreelancer) {
      this.freelancerId = this.userService.user().roleId()
    }
    if (previous !== null) {
      const { search,
        freelancerId } = JSON.parse(
          previous
        ) as InvoiceSearchVM;
      this.searchForm.patchValue({
        search: search,
        freelancerId: freelancerId
      });
    } else {
      const searchModel: InvoiceSearchVM = {
        pageIndex: 1,
        pageSize: 6,
      };
      if (this.isFreelancer) {
        searchModel.freelancerId = this.userService.user().roleId()
      }
      this.store.dispatch(new fromInvoiceAction.UpdateSearch(searchModel));
    }
    this.loadLookups();
    this.loading$ = this.store.pipe(
      select(fromInvoice.getLoading),
      takeWhile(() => this.componentActive)
    );

    this.result$ = this.store.pipe(
      select(fromInvoice.getSearchResult),
      takeWhile(() => this.componentActive)
    );
    this.noRecords$ = this.store.pipe(
      select(fromInvoice.getNoRecords),
      takeWhile(() => this.componentActive)
    );

    this.currentPage$ = this.store.pipe(
      select(fromInvoice.getCurrentIndex),
      takeWhile(() => this.componentActive)
    );
    this.totalRecords$ = this.store.pipe(
      select(fromInvoice.getTotalRecord),
      takeWhile(() => this.componentActive)
    );
    this.pageSize$ = this.store.pipe(
      select(fromInvoice.getPageSize),
      takeWhile(() => this.componentActive)
    );
    this.searchModel$ = this.store.pipe(
      select(fromInvoice.getSearchModel),
      takeWhile(() => this.componentActive)
    );
    this.subscribeSearch();
  }
  subscribeSearch() {
    this.searchModel$.subscribe((res) => {
      if (res) {
        this.searchModel = res;
        this.store.dispatch(
          new fromInvoiceAction.LoadInvoiceList({ ...this.searchModel })
        );
      }
    });
    this.searchForm.get('clientId')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, clientId: res };
      this.store.dispatch(new fromInvoiceAction.UpdateSearch(update));
    });
    this.searchForm.get('freelancerId')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, freelancerId: res };
      this.store.dispatch(new fromInvoiceAction.UpdateSearch(update));
    });
    this.searchForm.get('jobId')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, jobId: res };
      this.store.dispatch(new fromInvoiceAction.UpdateSearch(update));
    });
    this.searchForm.get('state')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, state: res };
      this.store.dispatch(new fromInvoiceAction.UpdateSearch(update));
    });
    this.searchForm.get('attributes')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, attributes: res };
      this.store.dispatch(new fromInvoiceAction.UpdateSearch(update));
    });
    this.searchForm.get('dateFrom')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, dateFrom: res };
      this.store.dispatch(new fromInvoiceAction.UpdateSearch(update));
    });
    this.searchForm.get('dateTo')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, dateTo: res };
      this.store.dispatch(new fromInvoiceAction.UpdateSearch(update));
    });
    this.searchForm.get('search')?.valueChanges.subscribe((res) => {
      if ((res && res.length > 2) || !res) {
        const update = { ...this.searchModel, pageIndex: 1, search: res };
        this.store.dispatch(new fromInvoiceAction.UpdateSearch(update));
      }
    });
  }
  deleteInvoice(data: InvoiceVM) {
    if (data && data.id) {
      // const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      //   data: {
      //     type: 'warning',
      //     title: this.translateService.instant('administration.invoices.table.remove.title'),
      //     message: this.translateService.instant('administration.invoices.table.remove.message', { name: data.name }),
      //     cancelCode: 'common.buttons.cancel',
      //     confirmCode: 'common.buttons.yes-remove',
      //   }
      // });
      // dialogRef.afterClosed().subscribe(result => {
      //   if (result && data && data.id) {
      //     this.invoiceService.deleteInvoice(data.id).subscribe(res => {
      //       this.toastrService.success(this.translateService.instant('notification.delete.invoice.success'));
      //       this.store.dispatch(
      //         new fromInvoiceAction.LoadInvoiceList({ ...this.searchModel })
      //       );
      //     })
      //   }
      // });
    }
  }
  loadLookups() {
    this.translateService.get('invoices.fields.attributes').subscribe(res => {
      this.attributesLK = FormConfig.invoices.attributes.map(a => {
        return {
          text: res[a],
          value: a
        }
      });
    });
    this.translateService.get('invoices.fields.states').subscribe(res => {
      this.stateLK = FormConfig.invoices.states.map(a => {
        return {
          text: res[a],
          value: a
        }
      });
    });
    if (this.isFreelancer) {
      this.invoiceService.getFreelancerJobsAssignments(this.freelancerId).subscribe(res => {
        this.jobList = this.sortOption((res.data || []).map(a => this.invoiceMappingService.transformJob(a)).map(a => {
          return {
            text: a.shortTitle,
            value: a.id
          }
        }));
      });
    } else {
      this.jobService
        .getJobs({
          limit: 1000000,
          order_by: 'title',
          order_dir: 'asc',
          only_fields: ['job.id', 'job.title'],
          filters: []
        })
        .subscribe((res) => {
          this.jobList = this.sortOption(res.data
            ? res.data.map((a) => {
              return {
                value: a.id,
                text: a.title,
              };
            })
            : []);
        });
      this.freelancerService
        .getFreelancers({
          limit: 1000000,
          only_fields: ['freelancer.id,freelancer.lastname,freelancer.firstname,freelancer.zip,freelancer.city,user.id,user.status'],
          filters: [{ key: 'only_approved', value: true }]
        })
        .subscribe((res) => {
          this.freelancerList = this.sortOption(res.data
            ? res.data.map((a) => {
              return {
                value: a.id,
                text: a.lastname + ' ' + a.firstname,
                info: a.zip + ' ' + a.city,
              };
            })
            : []);
        });
    }
  }
  pageChange(event: any) {
    const update = {
      ...this.searchModel,
      pageSize: event.pageSize,
      pageIndex: event.pageIndex + 1,
    };
    this.store.dispatch(new fromInvoiceAction.UpdateSearch(update));
  }
  sortOption(options: OptionVM[]) {
    return options.sort((a: OptionVM, b: OptionVM) =>
      a.text && b.text ? (a.text.toString().toUpperCase() > b.text.toString().toUpperCase() ? 1 : b.text.toString().toUpperCase() > a.text.toString().toUpperCase() ? -1 : 0) : 0
    );
  }
  ngOnDestroy(): void {
    this.componentActive = false;
  }
  cardClicked(data: InvoiceVM) {
    if (this.userService.user().role() !== 'freelancer' && data.state === 'issued') {
      this.gotoCheck(data);
    } else {
      this.gotoDetail(data)
    }
  }
  gotoDetail(data: InvoiceVM) {
    this.router.navigate(['/invoices', data.id]);
  }
  gotoCheck(data: InvoiceVM) {
    this.router.navigate(['/invoices/check', data.id]);
  }
  download() {
    this.searchModel$.pipe(take(1)).subscribe(model => {
      if (model) {
        const searchModel = this.invoiceMappingService.searchRequest(model);
        (this.userService.user().role() === 'freelancer' ?
          this.invoiceService
            .getFreelancerInvoices(this.userService.user().roleId(), { include: searchModel.include, filters: searchModel.filters, limit: 1000000, page: 1 }) : this.invoiceService
              .getInvoices({ include: searchModel.include, filters: searchModel.filters, limit: 1000000, page: 1 })).subscribe(res => {
                const downloadColumns = ['number', 'total', 'withDiscount', 'comment', 'issuedAt', 'stateName', 'summaryFrom', 'summaryTo', 'freelancer_name', 'paymentTarget'];
                if (res && res.data && res.data.length > 0) {
                  const data = (res.data || []).map(invoice => {
                    return {
                      ...invoice,
                      withDiscount: invoice.with_discount ? this.translateService.instant('common.labels.' + (invoice.with_discount ? 'yes' : 'no')) : '',
                      issuedAt: invoice.issued_at ? this.formatService.date(invoice.issued_at) : '',
                      stateName: this.translateService.instant('invoices.fields.states.' + invoice.state),
                      summaryFrom: invoice.summary?.from || '',
                      summaryTo: invoice.summary?.to || '',
                      paymentTarget: invoice.payment_target ? this.formatService.date(invoice.payment_target) : '',
                    }
                  });
                  const fieldNames = this.downloadColumns.map(a => this.translateService.instant('invoices.table.' + a));
                  const exportList: any = data.map((a: any) => {
                    const obj: any = {};
                    this.downloadColumns.forEach(x => {
                      obj[x] = a[x] || '';
                    });
                    return obj;
                  });
                  this.fileExportService.downloadCSV({
                    headerFields: fieldNames,
                    data: exportList,
                    filePrefix: 'invoices_table'
                  });
                }
              });
      }
    });
  }
  downloadZip() {
    this.searchModel$.pipe(take(1)).subscribe(model => {
      if (model) {
        const searchModel = this.invoiceMappingService.searchRequest(model);
        const invoiceDownloadURL = this.invoiceService.getDownloadInvoiceURL({ include: searchModel.include, filters: searchModel.filters });
        this.fileExportService.getDownload({ url: invoiceDownloadURL, fileName: 'invoices_' + this.formatService.date(new Date(), true) + '.zip', mimeType: 'zip' });
      }
    });
  }
}
