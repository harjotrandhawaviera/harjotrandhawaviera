import { Component, OnInit } from '@angular/core';
import { AdministrationFacade } from '../administration/+state/administration.facade';
import { OptionVM } from '../model/option.model';
import { Observable, of } from 'rxjs';
import { AdministrationModel, AdministrationModelSearchVM } from '../model/administartion.model';
import { TranslateService } from '../services/translate.service';
import { FileExportService } from '../services/file-export.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit {
  fileList: OptionVM | any;
  fileType: OptionVM | any;

  filter = new FormGroup({
    agentName: new FormControl(),
    eventNames: new FormControl([]),
    search: new FormControl()
  });

  searchModel: AdministrationModelSearchVM = {};
  displayedColumns = [
    'createdAt',
    'performer_name',
    'message',
    'referenceName',
    'action'
  ];
  LogsList: OptionVM | any;
  LogsDataList: OptionVM | any;
  AgentList: OptionVM | any;
  loading$: Observable<boolean> = of(false);
  noRecords$: Observable<boolean> = of(false);
  paginator: any;

  constructor(private  administrationFacade: AdministrationFacade,
              private translateService: TranslateService,
              private fileExportService: FileExportService) { }

  ngOnInit(): void {
    this.administrationFacade.loadLogsList();
    this.administrationFacade.getLogsList$.subscribe((res: any) => {
      this.LogsList = this.sortOption(
        res.data
          ? res.data.map((a: any) => {
            return {
              id: a?.id,
              date: a?.created_at,
              name: a?.performer_name,
              details: a?.message,
              project: a?.reference_id,
              rm: a?.reference_model
            };
          })
          : []
      );
      this.paginator = res?.meta?.pagination;
    });
    this.administrationFacade.getLogsDataList$.subscribe((res: any) => {
      this.LogsDataList = this.sortOption(
        res.data
          ? res.data.map((a: any) => {
            return {
              createdAt: a?.created_at,
              performer_name: a?.performer_name,
              message: a?.message,
              referenceName: a?.reference_model
            };
          })
          : []
      );
    });
    this.administrationFacade.loadAgentlist();
    this.administrationFacade.getAgentList$.subscribe((res: any) => {
      this.AgentList = this.sortOption(
        res.data
          ? res.data.map((a: any) => {
            return {
              value: a.id,
              text: [a.lastname, a.firstname].join(' '),
            };
          })
          : []
      );
    });
    this.filter.get('agentName')?.valueChanges.subscribe((res) => {
      // @ts-ignore
      this.searchModel = { ...this.searchModel, agentName: res};
      setTimeout(() => {
        this.administrationFacade.loadUpdateLogSearchList(this.searchModel);
      }, 1000);
    });
    this.filter.get('eventNames')?.valueChanges.subscribe((res) => {
      // @ts-ignore
      this.searchModel = { ...this.searchModel, eventNames: res};
      setTimeout(() => {
        this.administrationFacade.loadUpdateLogSearchList(this.searchModel);
      }, 1000);
    });
    this.filter.get('search')?.valueChanges.subscribe((res) => {
      if ((res && res.length > 2) || !res) {
        this.searchModel = { ...this.searchModel, search: res };
        setTimeout(() => {
          this.administrationFacade.loadUpdateLogSearchList(this.searchModel);
        }, 1000);
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
    this.administrationFacade.loadUpdateLogSearchList(update);
  }
  // download() {
  //   const update = true;
  //   this.administrationFacade.exportLogsList(update);
  //   this.administrationFacade.getLogsList$.subscribe((res) => {
  //     if ('data' in res) {
  //       const exportList: AdministrationModel[] = [];
  //       // @ts-ignore
  //       const exportData = res.data;
  //       // tslint:disable-next-line:no-unused-expression
  //       exportData.forEach((list: any) => {
  //         exportList.push({
  //           id: list?.id,
  //           date: list?.created_at,
  //           name: list?.performer_name,
  //           details: list?.message,
  //           project: list?.reference_id,
  //         });
  //       });
  //       const fieldNames = Object.keys(exportList[0]).map((a) =>
  //         this.translateService.instant('administration.table.' + a)
  //       );
  //       this.fileExportService.downloadCSV({
  //         headerFields: fieldNames,
  //         data: exportList,
  //         filePrefix: 'administration_table',
  //       });
  //     }
  //   });
  // }
  dataList() {
    this.administrationFacade.loadLogsDataList(this.searchModel);
    setTimeout(() => {
      this.downloadList();
    }, 5000);
  }
  downloadList() {
    const fieldNames = Object.keys(this.LogsDataList[0]).map((a) =>
      this.translateService.instant('administration.logs.table.' + a)
    );
    this.fileExportService.downloadCSV({ data: this.LogsDataList, filePrefix: 'download', headerFields: fieldNames });
  }
}
