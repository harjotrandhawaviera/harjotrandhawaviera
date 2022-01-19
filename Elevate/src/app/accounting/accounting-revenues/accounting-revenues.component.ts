import { Component, OnInit } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { Observable, of } from 'rxjs';

import { Accounting } from '../../model/accounting.model';
import { AccountingFacade } from '../+state/accounting.facade';
import { DatePipe } from '@angular/common';
import { FileExportService } from '../../services/file-export.service';
import { MY_FORMATS } from '../../model/date-format.model';
import { MatDialog } from '@angular/material/dialog';
import { OptionVM } from '../../model/option.model';
import { ReasonBoxComponent } from '../../core/reason-box/reason-box.component';
import { Router } from '@angular/router';
import { TranslateService } from '../../services/translate.service';

@Component({
  selector: 'app-accounting-revenues',
  templateUrl: './accounting-revenues.component.html',
  styleUrls: ['./accounting-revenues.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class AccountingRevenuesComponent implements OnInit {
  revenueCustomer: OptionVM | any;
  revenueProject: OptionVM | any;
  revenueJobs: OptionVM | any;
  revenueFreelancers: OptionVM | any;
  revenuesList: OptionVM | any;
  revenueForm = new FormGroup({
    client: new FormControl(),
    project: new FormControl(),
    jobs: new FormControl(),
    start: new FormControl(),
    end: new FormControl(),
    freelancer: new FormControl()
  });
  noRecords$: Observable<boolean> = of(false);
  loading$: Observable<boolean> = of(false);
  result: any;
  paginator: any;
  aggregation: any;
  aggregationFinal: number | undefined;
  hasFilter = false;
  noRecords = false;
  totalRevenue = 0;
  averageRevenue = 0;
  slots: any = {};
  isChangedBlock = -1;
  showMyContainer: boolean = false;
  row: any;
  constructor(private accountingFacade: AccountingFacade,
              private translateService: TranslateService,
              private datePipe: DatePipe,
              private fileExportService: FileExportService,
              private router: Router,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.accountingFacade.accountingPreparationLoadCustomer();
    this.accountingFacade.accountingPreparationLoadProject();
    this.accountingFacade.accountingPreparationLoadJobs();
    this.accountingFacade.revenueFreelancersLoad();

    this.accountingFacade.getAccountPrepareCustomer$.subscribe((res: any) => {
      if (res.data) {
        this.revenueCustomer = this.sortOption(
          res.data
            ? res.data.map((a: any) => {
              return {
                value: a.id,
                text: a.name
              };
            })
            : []
        );
      }
    });
    this.accountingFacade.getAccountPrepareProject$.subscribe((r: any) => {
      this.revenueProject = this.sortOption(
        r.data
          ? r.data.map((a: any) => {
            return {
              value: a.id,
              text: a.name
            };
          })
          : []
      );
    });

    this.accountingFacade.getAccountPrepareJobs$.subscribe((r: any) => {
      this.revenueJobs = this.sortOption(
        r.data
          ? r.data.map((a: any) => {
            return {
              value: a.id,
              text: a.title
            };
          })
          : []
      );
    });

    this.accountingFacade.getFreelancersList$.subscribe((r: any) => {
      this.revenueFreelancers = this.sortOption(
        r.data
          ? r.data.map((a: any) => {
            return {
              value: a.id,
              text: a.firstname + ' ' + a.lastname,
              info: a.city + ' ' + a.zip
            };
          })
          : []
      );
    });
    this.accountingFacade.getAccountingRevenue$.subscribe((r: any) => {
      this.revenuesList = this.sortOption(
        r.data
          ? r.data.map((a: any) => {
            return {
              value: a?.id,
              created_at: a?.created_at,
              title: a?.job?.data.title,
              name: a?.freelancer?.data?.fullname,
              total: a?.total,
              sales: a?.sales_volume.map((res: any) => {
                return { saleslot: res?.saleslot, value: res?.value };
              })
            };
          })
          : []
      );
      if ('data' in r) {
        this.result = r?.data;
        this.paginator = r?.meta?.pagination;
        this.aggregation = r.meta?.aggregates;
        this.aggregationFinal = Number(this.aggregation?.bills_total_sum) + this.aggregation?.assignments_billable_not_billed_total_sum;
        this.totalRevenue = r?.meta?.summary?.total;
        this.averageRevenue = r?.meta?.summary?.average;
        this.slots = r?.meta?.summary?.slots;
      }
      this.slots = Object.keys(this.slots).map((key: any) => {
        return { name: key, value: this.slots[key] };
      });
    });
    this.revenueForm.get('client')?.valueChanges.subscribe((res) => {
      const projectId = this.revenueForm.get('project')?.value;
      this.accountingFacade.accountingPreparationLoadProjects({client_id: res, project_id: projectId});
      this.accountingFacade.revenueLists({client_id: res});
      this.hasFilter = true;
    });
    this.revenueForm.get('project')?.valueChanges.subscribe((res) => {
      const clientId = this.revenueForm.get('client')?.value;
      this.accountingFacade.accountingPreparationLoadJobs({client_id: clientId, project_id: res});
      this.accountingFacade.revenueLists({client_id: clientId, project_id: res});
      this.hasFilter = true;
    });
    this.revenueForm.get('jobs')?.valueChanges.subscribe((res) => {
      const clientId = this.revenueForm.get('client')?.value;
      const projectId = this.revenueForm.get('project')?.value;
      this.accountingFacade.revenueLists({client_id: clientId, project_id: projectId, jobs_id: res});
      this.hasFilter = true;
    });
    this.revenueForm.get('start')?.valueChanges.subscribe((res) => {
      const clientId = this.revenueForm.get('client')?.value;
      const projectId = this.revenueForm.get('project')?.value;
      const jobId = this.revenueForm.get('jobs')?.value;
      const date = this.datePipe.transform(res, 'yyyy-MM-dd yy:hh:ss');
      this.accountingFacade.revenueLists({ client_id: clientId, project_id: projectId, jobs_id: jobId, dateFrom: date });
      this.hasFilter = true;
    });
    this.revenueForm.get('end')?.valueChanges.subscribe((res) => {
      const clientId = this.revenueForm.get('client')?.value;
      const projectId = this.revenueForm.get('project')?.value;
      const jobId = this.revenueForm.get('jobs')?.value;
      const dateFrom = this.revenueForm.get('start')?.value;
      const date = this.datePipe.transform(res, 'yyyy-MM-dd yy:hh:ss');
      this.accountingFacade.revenueLists({
        client_id: clientId,
        project_id: projectId,
        jobs_id: jobId,
        dateFrom,
        dateTo: date
      });
      this.hasFilter = true;
    });
    this.revenueForm.get('freelancer')?.valueChanges.subscribe((res) => {
      const clientId = this.revenueForm.get('client')?.value;
      const projectId = this.revenueForm.get('project')?.value;
      const jobId = this.revenueForm.get('jobs')?.value;
      const dateFrom = this.revenueForm.get('start')?.value;
      const dateTo = this.revenueForm.get('end')?.value;
      const dateF = this.datePipe.transform(dateFrom, 'yyyy-MM-dd yy:hh:ss');
      const dateT = this.datePipe.transform(dateTo, 'yyyy-MM-dd yy:hh:ss');
      this.accountingFacade.revenueLists({
        client_id: clientId,
        project_id: projectId,
        jobs_id: jobId,
        dateFrom: dateF,
        dateTo: dateT,
        freelancerId: res
      });
      this.hasFilter = true;
    });
  }

  pageChange(event: any) {
    const clientId = this.revenueForm.get('client')?.value;
    const projectId = this.revenueForm.get('project')?.value;
    const jobId = this.revenueForm.get('jobs')?.value;
    const dateFrom = this.revenueForm.get('start')?.value;
    const dateTo = this.revenueForm.get('end')?.value;
    const dateF = this.datePipe.transform(dateFrom, 'yyyy-MM-dd yy:hh:ss');
    const dateT = this.datePipe.transform(dateTo, 'yyyy-MM-dd yy:hh:ss');
    const freeID = this.revenueForm.get('freelancer')?.value;
    const update: any = {
      pageSize: event.pageSize,
      pageIndex: event.pageIndex + 1,
      client_id: clientId,
      project_id: projectId,
      jobs_id: jobId,
      dateFrom: dateF,
      dateTo: dateT,
      freelancerId: freeID
    };
    this.accountingFacade.revenueLists(update);
  }

  sortOption(options: OptionVM[]) {
    return options.sort((a: OptionVM, b: OptionVM) =>
      a.text && b.text ? (a.text > b.text ? 1 : b.text > a.text ? -1 : 0) : 0
    );
  }
  navigateToDetail(row: Accounting){
    this.router.navigate(['accounting', 'revenues', row]);
  }
  download() {
    const clientId = this.revenueForm.get('client')?.value;
    const projectId = this.revenueForm.get('project')?.value;
    const jobId = this.revenueForm.get('jobs')?.value;
    const dateFrom = this.revenueForm.get('start')?.value;
    const dateTo = this.revenueForm.get('end')?.value;
    const dateF = this.datePipe.transform(dateFrom, 'yyyy-MM-dd yy:hh:ss');
    const dateT = this.datePipe.transform(dateTo, 'yyyy-MM-dd yy:hh:ss');
    const freeID = this.revenueForm.get('freelancer')?.value;
    const update: any = {
      client_id: clientId,
      project_id: projectId,
      jobs_id: jobId,
      dateFrom: dateF,
      dateTo: dateT,
      freelancerId: freeID
    };
    this.accountingFacade.exportSalesList(update);
    this.accountingFacade.getExportDetails$.subscribe((r: any) => {
      if (r.data) {
        const revenuesList = this.sortOption(
          r.data
            ? r.data.map((a: any, index: number) => {
              return {
                jobTitle: a?.job?.data?.title,
                clientName: a?.job?.data?.project?.data?.client?.data?.name,
                total: a?.total.toString(),
                appointedAt: a?.data ? a?.data[0]?.date?.data?.appointed_at : '',
                createdAt: a?.created_at,
                creatorName: a?.creator?.data?.name,
              };
            })
            : []
        );
        const fieldNames = Object.keys(revenuesList[0]).map((a) =>
          this.translateService.instant('revenues.table.' + a)
        );

        this.fileExportService.downloadCSV({
          headerFields: fieldNames,
          data: revenuesList,
          filePrefix: 'revenues_table',
        });
      }
    });
  }

  confirmModal(id: number) {
    this.dialog.open(ReasonBoxComponent, {
      data: {
        type: 'warning',
        title: this.translateService.instant(
          'revenue.confirm.remove.title'
        ),
        message: this.translateService.instant(
          'revenue.confirm.remove.message'
        ),
        cancelCode: 'revenue.buttons.cancel',
        confirmCode: 'revenues.table.actions.delete',
      },
    }).afterClosed().subscribe(res => {
      if (res) {
        this.accountingFacade.deleteSalesInvoice(id);
      }
    });
  }
}
