import {Component, OnInit} from '@angular/core';
import {OptionVM} from '../../model/option.model';
import {AdministrationFacade} from '../../administration/+state/administration.facade';
import {Router} from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';
import {AdministrationModelSearchVM} from '../../model/administartion.model';
import {Observable, of} from 'rxjs';
import {TranslateService} from '../../services/translate.service';
import {FileExportService} from '../../services/file-export.service';

@Component({
  selector: 'app-incentive-list',
  templateUrl: './incentive-list.component.html',
  styleUrls: ['./incentive-list.component.scss']
})
export class IncentiveListComponent implements OnInit {
  filterValue = new FormGroup({
    search: new FormControl()
  });
  searchModel: AdministrationModelSearchVM = {};
  displayedColumns = [
    'name',
    'checkin',
    'sales_report',
    'picture_documentation',
    'action'
  ];
  IncentiveList: OptionVM | any;
  IncentiveListData: OptionVM | any;
  list: OptionVM | any;
  noRecords$: Observable<boolean> = of(false);
  loading$: Observable<boolean> = of(false);
  paginator: any;

  constructor(private administrationFacade: AdministrationFacade,
              private router: Router,
              private translateService: TranslateService,
              private fileExportService: FileExportService,) {
  }

  ngOnInit(): void {
    this.administrationFacade.loadIncentive();
    this.administrationFacade.getIncentiveList$.subscribe((res: any) => {
      this.IncentiveList = this.sortOption(
        res.data
          ? res.data.map((a: any) => {
            return {
              id: a?.id,
              name: a?.name,
              checkin: a?.checkin,
              picture_documentation: a?.picture_documentation,
              sales_report: a?.sales_report,
            };
          })
          : []
      );
      this.paginator = res?.meta?.pagination;
    });
    this.administrationFacade.getIncentiveList$.subscribe((res: any) => {
      this.IncentiveListData = this.sortOption(
        res.data
          ? res.data.map((a: any) => {
            return {
              name: a?.name,
              checkin: a?.checkin,
              sales_report: a?.sales_report,
              picture_documentation: a?.picture_documentation,
            };
          })
          : []
      );
    });
    this.filterValue.get('search')?.valueChanges.subscribe((res) => {
      if ((res && res.length > 2) || !res) {
        this.searchModel = {...this.searchModel, search: res};
        setTimeout(() => {
          this.administrationFacade.loadUpdateIncentiveSearchList(this.searchModel);
        }, 1000);
      }
    });
  }

  navigateToDetail(row: any) {
    this.router.navigate(['administration', 'incentives', row]);
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
    this.administrationFacade.loadUpdateIncentiveSearchList(update);
  }

  downloadList() {
    const fieldNames = Object.keys(this.IncentiveListData[0]).map((a) =>
      this.translateService.instant('administration.incentives.table.' + a)
    );
    this.fileExportService.downloadCSV({data: this.IncentiveListData, filePrefix: 'administration_incentives_table', headerFields: fieldNames});
  }
}
