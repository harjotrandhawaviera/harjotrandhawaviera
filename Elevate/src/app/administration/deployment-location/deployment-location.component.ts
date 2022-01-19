import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '../../services/translate.service';
import {FileExportService} from '../../services/file-export.service';
import {MatDialog} from '@angular/material/dialog';
import {AdministrationFacade} from '../+state/administration.facade';
import {OptionVM} from '../../model/option.model';
import {Observable, of} from 'rxjs';
import {FormControl, FormGroup} from '@angular/forms';
import {AdministrationModelSearchVM} from '../../model/administartion.model';
import {ReasonBoxComponent} from '../../core/reason-box/reason-box.component';

@Component({
  selector: 'app-deployment-loaction',
  templateUrl: './deployment-location.component.html',
  styleUrls: ['./deployment-location.component.scss']
})
export class DeploymentLocationComponent implements OnInit {
  deploymentList: OptionVM | any;
  deploymentDataList: OptionVM | any;
  result: any;
  loading$: Observable<boolean> = of(false);
  searchModel: AdministrationModelSearchVM = {};
  paginator: any;
  searchForm = new FormGroup({
    from: new FormControl(),
    to: new FormControl(),
    search: new FormControl()
  });
  displayedColumns = [
    'pos_name',
    'number',
    'address',
    'action'
  ];
  siteData = [
    'ID',
    'POS Name',
    'POS Number',
    'Address',
    'Telepho'
  ];
  row = 123;

  constructor(private router: Router,
              private translateService: TranslateService,
              private fileExportService: FileExportService,
              private dialog: MatDialog,
              private administrationFacade: AdministrationFacade) {
  }

  ngOnInit(): void {
    this.administrationFacade.loadDemployment();
    this.administrationFacade.getDeploymentList$.subscribe((res: any) => {
      this.deploymentList = this.sortOption(
        res.data
          ? res.data.map((a: any) => {
            return {
              name: a.name,
              num: a.number,
              add: a.address + ',' + a.zip + ' ' + a.city,
              id: a.id
            };
          })
          : []
      );
      this.paginator = res?.meta?.pagination;
    });
    this.administrationFacade.getSiteDataList$.subscribe((res: any) => {
      this.deploymentDataList = this.sortOption(
        res.data
          ? res.data.map((a: any) => {
            return {
              id: a?.id,
              name: a.name,
              number: a.number,
              fulladdress: a.address + ',' + a.zip + ' ' + a.city,
              phone: a?.phone,
              email: a?.email,
              fax: a?.fax,
              group: a?.group,
              categoryName: a?.category,
              contactFullname: a?.contact?.data?.firstname + ' ' + a?.contact?.data?.lastname,
              contactSalutation: a?.contact?.data?.position,
              contactPosition: a?.contact?.data?.position,
              contactDepartment: a?.contact?.data?.department,
              contactEmail: a?.contact?.data?.email,
              contactPhone: a?.contact?.data?.phone,
              contactData: a?.contact?.data?.data,
            };
          })
          : []
      );
    });
    this.administrationFacade.getAdministrationSearchList$.subscribe((res) => {
      if ('data' in res) {
        this.result = res?.data;
      }
    });
    this.searchForm.get('from')?.valueChanges.subscribe((res) => {
      // @ts-ignore
      this.searchModel = {...this.searchModel, from: res};
      setTimeout(() => {
        this.administrationFacade.loadUpdateDeploymentSearchList(this.searchModel);
      }, 1000);
    });
    this.searchForm.get('to')?.valueChanges.subscribe((res) => {
      // @ts-ignore
      this.searchModel = {...this.searchModel, to: res};
      setTimeout(() => {
        this.administrationFacade.loadUpdateDeploymentSearchList(this.searchModel);
      }, 1000);
    });
    this.searchForm.get('search')?.valueChanges.subscribe((res) => {
      if ((res && res.length > 2) || !res) {
        this.searchModel = {...this.searchModel, search: res};
        setTimeout(() => {
          this.administrationFacade.loadUpdateDeploymentSearchList(this.searchModel);
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

  navigateToDetail(row: any) {
    this.router.navigate(['administration', 'sites', row]);
  }

  navigateToNew() {
    this.router.navigate(['administration', 'sites', 'create']);
  }

  pageChange(event: any) {
    const update = {
      ...this.searchModel,
      pageSize: event.pageSize,
      pageIndex: event.pageIndex + 1,
    };
    this.administrationFacade.loadUpdateDeploymentSearchList(update);
  }

  open(row: any) {
    this.dialog.open(ReasonBoxComponent, {
      data: {
        type: 'warning',
        title: this.translateService.instant(
          'administration.sites.table.remove.title'
        ),
        message: this.translateService.instant(
          'administration.sites.table.remove.message'
        ),
        cancelCode: 'administration.client.buttons.cancel',
        confirmCode: 'todos.set-state.buttons.confirm',
      },
    }).afterClosed().subscribe(res => {

      if (res) {
        const id = row;
        this.administrationFacade.deleteDeployInvoice(id);
        setTimeout(() => {
          this.administrationFacade.loadUpdateDeploymentSearchList({pageIndex: this.paginator.current_page});
        }, 1000);
      }
    });
  }

  downloadData() {
    this.administrationFacade.loadSiteData(this.searchModel);
    setTimeout(() => {
      this.downloadList();
    }, 3000);
  }

  downloadList() {
    const fieldNames = Object.keys(this.deploymentDataList[0]).map((a) =>
        this.translateService.instant('administration.sites.table.' + a)
      );
    this.fileExportService.downloadCSV({
        data: this.deploymentDataList,
        filePrefix: 'administration',
        headerFields: fieldNames
      });
  }
}
