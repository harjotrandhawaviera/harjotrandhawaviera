import {Component, OnInit} from '@angular/core';
import {AdministrationFacade} from '../../administration/+state/administration.facade';
import {OptionVM} from '../../model/option.model';
import {FormControl, FormGroup} from '@angular/forms';
import {AdministrationModelSearchVM} from '../../model/administartion.model';
import {ReasonBoxComponent} from '../../core/reason-box/reason-box.component';
import {MatDialog} from '@angular/material/dialog';
import {TranslateService} from '../../services/translate.service';
import {FileExportService} from '../../services/file-export.service';
import {Router} from '@angular/router';
import {Observable, of} from 'rxjs';

@Component({
  selector: 'app-insurance-list',
  templateUrl: './insurance-list.component.html',
  styleUrls: ['./insurance-list.component.scss']
})
export class InsuranceListComponent implements OnInit {
  id = '';
  // tslint:disable-next-line:ban-types
  c = 'create';
  displayedColumns = [
    'id',
    'name',
    'external_identifier',
    'insuranceType',
    'description',
    'action'
  ];
  noRecords$: Observable<boolean> = of(false);
  InsuranceList: OptionVM | any;
  InsuranceListData: OptionVM | any;
  paginator: any;
  filterValue = new FormGroup({
    option: new FormControl(),
    search: new FormControl()
  });
  searchModel: AdministrationModelSearchVM = {};
  loading$: Observable<boolean> = of(false);

  constructor(private administrationFacade: AdministrationFacade,
              private dialog: MatDialog,
              private translateService: TranslateService,
              private fileExportService: FileExportService,
              private router: Router,
             ) {
  }

  ngOnInit(): void {
    this.administrationFacade.loadInsurance();
    this.administrationFacade.getInsuranceList$.subscribe((res: any) => {
      this.InsuranceList = this.sortOption(
        res.data
          ? res.data.map((a: any) => {
            return {
              id: a?.id,
              name: a?.name,
              external_identifier: a?.external_identifier,
              type: a?.type,
              description: a?.description,
              in_use: a?.in_use
            };
          })
          : []
      );
      this.paginator = res?.meta?.pagination;
    });
    this.administrationFacade.getInsuranceList$.subscribe((res: any) => {
      this.InsuranceListData = this.sortOption(
        res.data
          ? res.data.map((a: any) => {
            return {
              id: a?.id,
              name: a?.name,
              external_identifier: a?.external_identifier,
              type: a?.type,
              description: a?.description,
            };
          })
          : []
      );
      this.paginator = res?.meta?.pagination;
    });
    this.filterValue.get('option')?.valueChanges.subscribe((res) => {
      // @ts-ignore
      this.searchModel = {...this.searchModel, to: res};
      setTimeout(() => {
        this.administrationFacade.loadUpdateInsuranceSearchList(this.searchModel);
      }, 1000);
    });
    this.filterValue.get('search')?.valueChanges.subscribe((res) => {
      if ((res && res.length > 2) || !res) {
        this.searchModel = {...this.searchModel, search: res};
        setTimeout(() => {
          this.administrationFacade.loadUpdateInsuranceSearchList(this.searchModel);
        }, 1000);
      }
    });
  }

// tslint:disable-next-line:typedef

  sortOption(options: OptionVM[]) {
    return options.sort((a: OptionVM, b: OptionVM) =>
      a.text && b.text ? (a.text > b.text ? 1 : b.text > a.text ? -1 : 0) : 0
    );
  }

  deleteConfirmModal(row: any) {
    this.dialog.open(ReasonBoxComponent, {
      data: {
        type: 'warning',
        title: this.translateService.instant(
          'administration.health-insurances.table.remove.title'
        ),
        message: this.translateService.instant(
          'administration.health-insurances.table.remove.message'
        ),
        cancelCode: 'administration.health-insurances.buttons.cancel',
        confirmCode: 'administration.health-insurances.buttons.remove',
      },
    }).afterClosed().subscribe(res => {
      if (res) {
        const id = row;
        this.administrationFacade.deleteInsurance(id);
      }
    });
  }

  downloadList() {
    const fieldNames = Object.keys(this.InsuranceListData[0]).map((a) =>
      this.translateService.instant('administration.health-insurances.table.' + a)
    );
    this.fileExportService.downloadCSV({ data: this.InsuranceList, filePrefix: 'administration_health-insurances_table', headerFields: fieldNames });
  }

  navigateToDetail(row: any) {
    this.router.navigate(['administration', 'insurances', row]);
  }

  pageChange(event: any) {
    const update = {
      ...this.searchModel,
      pageSize: event.pageSize,
      pageIndex: event.pageIndex + 1,
    };
    this.administrationFacade.loadUpdateInsuranceSearchList(update);
  }
}
