import * as moment from 'moment';

import { Component, OnInit } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import {Observable, of} from 'rxjs';
import {animate, state, style, transition, trigger} from '@angular/animations';

import { AdministrationFacade } from '../administration/+state/administration.facade';
import {AdministrationModelSearchVM} from '../model/administartion.model';
import {FileExportService} from "../services/file-export.service";
import { MY_FORMATS } from './../model/date-format.model';
import { OptionVM } from '../model/option.model';

@Component({
  selector: 'app-maillogs',
  templateUrl: './maillogs.component.html',
  styleUrls: ['./maillogs.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', visibility: 'hidden', display: 'none'})),
      state('expanded', style({height: '*', visibility: 'visible'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MaillogsComponent implements OnInit {
  loading$: Observable<boolean> = of(false);
  mailLogs = new FormGroup({
    client: new FormControl(),
    search: new FormControl(),
    dateFrom: new FormControl(),
    dateTo: new FormControl()
  });
  searchModel: AdministrationModelSearchVM = {};
  displayedColumns = [
    'date',
    'sender',
    'recipient',
  ];
  mailLogsList: OptionVM | any;
  mailLogsDataList: OptionVM | any;
  mailLogsFreelancerList: OptionVM | any;
  paginator: any;
  date: any;
  expandedElement: any;
  constructor(private administrationFacade: AdministrationFacade,
              private fileExportService: FileExportService) { }

  ngOnInit(): void {
    this.administrationFacade.loadMailLogFreelancerlist();
    this.administrationFacade.getMailLogFreelancerData$.subscribe((res: any) => {
      if (res) {
        this.mailLogsFreelancerList = this.sortOption(
          res?.data
            ? res?.data.map((a: any) => {
              return {
                id: a?.city,
                text: [a?.firstname, a?.lastname].join(' '),
                info: [a?.city, a?.zip].join(' '),
                value: a?.user?.data?.email,
              };
            })
            : []
        );
      }
    });
    this.administrationFacade.loadMailLogList();
    this.administrationFacade.getMailLogList$.subscribe((res: any) => {
      this.mailLogsList = this.sortOption(
        res.data
          ? res.data.map((a: any) => {
            return {
              id: a?.id,
              from_email: Object.values(a?.from_email)[0] + ' (' + Object.keys(a?.from_email)[0] + ')',
              content: a?.content,
              to_email: Object.values(a?.to_email)[0] + ' (' + Object.keys(a?.to_email)[0] + ')',
              subject: a?.subject,
              sent_at: a?.sent_at
            };
          })
          : []
      );
      this.paginator = res?.meta?.pagination;
    });
    this.administrationFacade.getMailLogsDataList$.subscribe((res: any) => {
      this.mailLogsDataList = this.sortOption(
        res.data
          ? res.data.map((a: any) => {
            return {
              id: a?.id,
              from_email1: Object.values(a?.from_email)[0] + ' (' + Object.keys(a?.from_email)[0] + ')',
            };
          })
          : []
      );
    });
    this.mailLogs.get('client')?.valueChanges.subscribe((res) => {
      this.searchModel = {...this.searchModel, client: res};
      this.administrationFacade.loadMailLogListUpdate(this.searchModel);
      });
    this.mailLogs.get('dateFrom')?.valueChanges.subscribe((res) => {
      // @ts-ignore
      this.searchModel = {...this.searchModel, from: moment.utc(res).local().format('YYYY-MM-DD 00:00:00')};
      this.administrationFacade.loadMailLogListUpdate(this.searchModel);
    });
    this.mailLogs.get('dateTo')?.valueChanges.subscribe((res) => {
      // @ts-ignore
      this.searchModel = {...this.searchModel, to: moment.utc(res).local().format('YYYY-MM-DD 00:00:00')};
      this.administrationFacade.loadMailLogListUpdate(this.searchModel);
    });
    this.mailLogs.get('search')?.valueChanges.subscribe((res) => {
      if ((res && res.length > 2) || !res) {
        this.searchModel = {...this.searchModel, search: res};
        setTimeout(() => {
          this.administrationFacade.loadMailLogListUpdate(this.searchModel);
        }, 1000);
      }
    });
  }

  sortOption(options: OptionVM[]) {
    return options.sort((a: OptionVM, b: OptionVM) =>
      a.text && b.text ? (a.text > b.text ? 1 : b.text > a.text ? -1 : 0) : 0
    );
  }

  downloadList() {
    this.administrationFacade.loadLogsDataList(this.searchModel);
    const fieldNames = Object.keys(this.mailLogsDataList[0])
    this.fileExportService.downloadCSV({ data: this.mailLogsDataList, filePrefix: 'download', headerFields: fieldNames });
  }

  pageChange(event: any) {
    const update = {
      ...this.searchModel,
      pageSize: event.pageSize,
      pageIndex: event.pageIndex + 1,
    };
    this.administrationFacade.loadMailLogListUpdate(update);
  }
}
