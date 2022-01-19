import * as fromFreelancer from './../state';
import * as fromFreelancerAction from './../state/freelancer.actions';

import { Component } from '@angular/core';
import { TranslateService } from '../../services/translate.service';
import {Store} from '@ngrx/store';
import {Router} from '@angular/router';
import {OptionVM} from '../../model/option.model';
import * as fromCurrentUser from '../../root-state/user-state';
import { SelectionModel } from '@angular/cdk/collections';
import { FileExportService } from '../../services/file-export.service';
import { FreelancerExportVM } from '../../model/freelancer.model';
import { FormConfig } from '../../constant/forms.constant';
import { FormControl } from '@angular/forms';
import { StorageService } from '../../services/storage.service';
import { AgePipe } from '../../core/pipe/age.pipe';
import { FreelancerPopupComponent } from '../freelancer-popup/freelancer-popup.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-freelancer-advance-list',
  templateUrl: './freelancer-advance-list.component.html',
  styleUrls: ['./freelancer-advance-list.component.scss'],
  providers: [AgePipe]
})
export class FreelancerAdvanceListComponent {
  displayedColumns = [
    'select',
    'name',
    'gender',
    'age',
    'mobile',
    'email',
    'city',
    'zip',
    'date',
    'status'
  ];
  userList: OptionVM | any = [];
  pagination: any;
  loggedRole: any;
  searchModel: any;
  freelancerList: OptionVM | any;
  selection = new SelectionModel<any>(true, []);
  pageLK: OptionVM | any;
  pageSize = new FormControl();


  constructor(private translateService: TranslateService,
              private router: Router,
              private store: Store<fromFreelancer.State>,
              private storageService: StorageService,
              private agePipe: AgePipe,
              private dialog: MatDialog,
              private fileExportService: FileExportService) { }

  ngOnInit(): void {
    this.pageLK = FormConfig.report.pageSize.map((a) => {
      return {
        value: a,
        text: undefined
      };
    });
    this.pageSize.setValue('10');
    this.store.select(fromCurrentUser.getCurrentUserInfo).subscribe((res) => {
      if (res) {
        this.loggedRole = res?.role;
      }
    });
    this.searchModel = { limit: 10, page: 0 };
   // this.store.dispatch(new fromFreelancerAction.LoadUserList(this.searchModel));
    this.store.select(fromFreelancer.getUserList).subscribe((res: any) => {
      if (res) {
        this.userList = this.sortOption(
          res?.data?.data
            ? res?.data?.data?.map((b: any) => {
              return {
                id: b?.id,
                email: b?.user?.data?.email,
                fullname: b?.fullname,
                gender: b?.gender,
                age: this.agePipe.transform(b?.birthdate),
                mobile: b?.mobile,
                mobile_dial_code: b?.mobile_dial_code,
                zip: b?.zip,
                city: b?.city,
                created_at: b?.user?.data?.created_at,
                status: b?.user?.data?.status
              };
            })
            : []
        );
        this.pagination = res?.data?.meta?.pagination;
      }
    });
    this.pageSize.valueChanges.subscribe(val => {
      this.searchModel = { ...this.searchModel, page: 0, limit: val };
      this.store.dispatch(new fromFreelancerAction.LoadUserList(this.searchModel));
    });
  }
  sortOption(options: OptionVM[]) {
    return options.sort((a: OptionVM, b: OptionVM) =>
      a.text && b.text ? (a.text > b.text ? 1 : b.text > a.text ? -1 : 0) : 0
    );
  }

  navigateToDetail(row: any) {
    this.router.navigate(['/approval/freelancer-approved', row.id]);
  }

  pageChange(event: any) {
    const pageIndex = event.pageIndex + 1;
    this.searchModel = { ...this.searchModel, page: pageIndex, limit: this.pageSize.value };
    this.store.dispatch(new fromFreelancerAction.LoadUserList(this.searchModel));
  }


  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.userList.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.userList);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  getFilters(event: any) {
    this.searchModel = { ...this.searchModel, page: 0, limit: this.pageSize.value, filters: event };
    this.store.dispatch(new fromFreelancerAction.LoadUserList(this.searchModel));
  }

  openpopuup(row: any) {
    // localStorage.setItem('viewing',this.viewing)
    if (row) {
      if ((row.status === 'onboarding' || row.status === 'active')) {
        // this.router.navigate(['/administration/freelancers/profile', row.id]);
        this.dialog.open(FreelancerPopupComponent, {
          width: 'auto',
          data: {
            id: row.id,
          },
          disableClose: true,
          hasBackdrop: false
        });
      }
      else{
        this.dialog.open(FreelancerPopupComponent, {
          data: {
            id: row.id
          },
          disableClose: true,
          hasBackdrop: false
        });
      }
    }

  }

  download() {
    const selectedIds = this.selection.selected.map((d) => d.id);
    const data = selectedIds.length ? this.userList.filter((info: any) => selectedIds.indexOf(info.id) > -1) : this.userList;
    const exportList: FreelancerExportVM[] = [...data];
    const fieldNames = Object.keys(exportList[0]).map((a) =>
      this.translateService.instant('administration.freelancers.table.' + a)
    );
    this.fileExportService.downloadCSV({
      headerFields: fieldNames,
      data: exportList,
      filePrefix: 'administration_freelancers_table',
    });
  }

  email() {
    this.router.navigate(['/mails', {fromAdv: true}]);
    const selectedIds = this.selection.selected.map((d) => d.id);
    const data = selectedIds.length ? this.userList.filter((info: any) => selectedIds.indexOf(info.id) > -1) : this.userList;
    this.storageService.set('usersToEmail', JSON.stringify(data));
  }

  sms() {
    this.router.navigate(['/sms', {fromAdv: true}]);
    const selectedIds = this.selection.selected.map((d) => d.id);
    const data = selectedIds.length ? this.userList.filter((info: any) => selectedIds.indexOf(info.id) > -1) : this.userList;
    this.storageService.set('usersToSms', JSON.stringify(data));
  }
}
