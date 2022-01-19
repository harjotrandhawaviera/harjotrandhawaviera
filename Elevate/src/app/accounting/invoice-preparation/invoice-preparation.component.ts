import { Component, OnInit } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { Observable, of } from 'rxjs';

import { AccountingFacade } from '../+state/accounting.facade';
import { AccountingVM } from '../../model/accounting.model';
import { DatePipe } from '@angular/common';
import { MY_FORMATS } from '../../model/date-format.model';
import { OptionVM } from '../../model/option.model';

@Component({
  selector: 'app-invoice-preparation',
  templateUrl: './invoice-preparation.component.html',
  styleUrls: ['./invoice-preparation.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class InvoicePreparationComponent implements OnInit {
  accountCustomer: OptionVM | any;
  accountProject: OptionVM | any;
  accountJobs: OptionVM | any;
  invoicePrepareForm = new FormGroup({
    client: new FormControl(),
    project: new FormControl(),
    jobs: new FormControl(),
    start: new FormControl(),
    end: new FormControl()
  });
  hasFilter = false;
  noRecords$: Observable<boolean> = of(false);
  result$: Observable<AccountingVM[]> = of([]);
  linkParams: { start: string | null; } | undefined;
  constructor(private accountingFacade: AccountingFacade, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.accountingFacade.accountingPreparationLoadCustomer();
    this.accountingFacade.accountingPreparationLoadProject();
    this.accountingFacade.accountingPreparationLoadJobs();
    this.accountingFacade.getAccountPrepareCustomer$.subscribe((res: any) => {
      if (res.data) {
        this.accountCustomer = this.sortOption(
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
      this.accountProject = this.sortOption(
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
      this.accountJobs = this.sortOption(
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

    this.invoicePrepareForm.get('client')?.valueChanges.subscribe((res) => {
      this.accountingFacade.accountingPreparationLoadProject(res);
      this.accountingFacade.accountingPreparationLoadJobs({ client_id: res });
      this.accountingFacade.createPrepareTiles({ client_id: res });
      // @ts-ignore
      this.linkParams = { ...this.linkParams, client: res };
    });

    this.invoicePrepareForm.get('project')?.valueChanges.subscribe((res) => {
      const clientValue = this.invoicePrepareForm.get('client')?.value;
      this.accountingFacade.accountingPreparationLoadJobs({ client_id: clientValue, project_id: res });
      this.accountingFacade.createPrepareTiles({ client_id: clientValue, project_id: res });
    });

    this.invoicePrepareForm.get('start')?.valueChanges.subscribe((res) => {
      const dateSetup = this.datePipe.transform(res, 'yyyy-MM-dd yyyy:hh:ss');
      this.linkParams = {...this.linkParams, start: dateSetup};
    });
    this.invoicePrepareForm.get('end')?.valueChanges.subscribe((res) => {
      const endDateSetup = this.datePipe.transform(res, 'yyyy-MM-dd yyyy:hh:ss');
      // @ts-ignore
      this.linkParams = {...this.linkParams, end: endDateSetup};
    });
  }
  sortOption(options: OptionVM[]) {
    return options.sort((a: OptionVM, b: OptionVM) =>
      a.text && b.text ? (a.text > b.text ? 1 : b.text > a.text ? -1 : 0) : 0
    );
  }

  navigateToDetail(accounting: AccountingVM) {
    // this.router.navigate(['/jobs', job.id]);
  }
}
