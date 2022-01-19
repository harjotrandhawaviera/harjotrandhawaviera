import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReasonBoxComponent } from '../../core/reason-box/reason-box.component';
import { TranslateService } from '../../services/translate.service';
import {ApprovalRequestService} from '../../services/approval-request.service';
import {Store} from '@ngrx/store';
import * as fromApproval from '../state';
import * as fromApprovalAction from '../../approval/state/approval.actions';
import {Router} from '@angular/router';
import {OptionVM} from '../../model/option.model';
import {UserService} from '../../services/user.service';
import * as fromCurrentUser from '../../root-state/user-state';

import { AuthService } from '../../services/auth-service.service';
import { ToastrService } from 'ngx-toastr';
import {FormControl, FormGroup} from '@angular/forms';
import {ContractTypesService} from '../../services/contract-types.service';



@Component({
  selector: 'app-approval-new-freelancer',
  templateUrl: './approval-new-freelancer.component.html',
  styleUrls: ['./approval-new-freelancer.component.scss']
})


export class ApprovalNewFreelancerComponent implements OnInit {
  displayedColumns = [
    'name',
    'email',
    'city',
    'zip',
    'date',
    'button',
    'action'
  ];
  userList: OptionVM | any;
  pagination: any;
  loggedRole: any;
  searchModel: any = {};
  contractTypeLK: OptionVM[] = [];
  Form = new FormGroup({
    contractType: new FormControl(''),
    postcodesMin: new FormControl(''),
    postcodesMax: new FormControl(''),
    search: new FormControl(''),
  });

  constructor(private dialog: MatDialog,
              private translateService: TranslateService,
              private router: Router,
              private approvalRequestService: ApprovalRequestService,
              private toastrService: ToastrService,
              private authService: AuthService,
              private contractTypesService: ContractTypesService,
              private store: Store<fromApproval.State>,
              private userSvc: UserService) { }

  ngOnInit(): void {
    this.store.select(fromCurrentUser.getCurrentUserInfo).subscribe((res) => {
      if (res) {
        this.loggedRole = res?.role;
      }
    });
    const update = { ...this.searchModel, page: 1 };
    this.store.dispatch(new fromApprovalAction.LoadUserList(update));
    this.store.select(fromApproval.getUserList).subscribe((res: any) => {
      if (res) {
        this.userList = this.sortOption(
          res?.data?.data
            ? res?.data?.data?.map((b: any) => {
              return {
                id: b?.id,
                email: b?.user?.data?.email,
                fullname: b?.fullname,
                zip: b?.zip,
                city: b?.city,
                avatarId: b?.user?.data?.freelancer?.data?.face_picture_id,
                created_at: b?.user?.data?.created_at,
                ready_for_active: b?.ready_for_active
              };
            })
            : []
        );
        this.pagination = res?.data?.meta?.pagination;
      }
    });
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
    this.Form.get('contractType')?.valueChanges.subscribe((res) => {
      this.searchModel = { ...this.searchModel, page: 1, contractType: res };
      this.store.dispatch(new fromApprovalAction.LoadUserList(this.searchModel));
    });
    this.Form.get('postcodesMin')?.valueChanges.subscribe((res) => {
      this.searchModel = { ...this.searchModel, page: 1, postcodesMin: res };
      this.store.dispatch(new fromApprovalAction.LoadUserList(this.searchModel));
    });
    this.Form.get('postcodesMax')?.valueChanges.subscribe((res) => {
      this.searchModel = { ...this.searchModel, page: 1, postcodesMax: res };
      this.store.dispatch(new fromApprovalAction.LoadUserList(this.searchModel));
    });
    this.Form.get('search')?.valueChanges.subscribe((res) => {
      if ((res && res.length > 2) || !res) {
        this.searchModel = { ...this.searchModel, page: 1, search: res };
        this.store.dispatch(new fromApprovalAction.LoadUserList(this.searchModel));
      }
    });
  }
  sortOption(options: OptionVM[]) {
    return options.sort((a: OptionVM, b: OptionVM) =>
      a.text && b.text ? (a.text > b.text ? 1 : b.text > a.text ? -1 : 0) : 0
    );
  }


  open() {
    this.dialog.open(ReasonBoxComponent, {
      data: {
        title: this.translateService.instant('approval.freelancer-approval.fields.subject'),
        label: 'approval.freelancer-approval.fields.search-placeholder',
        needReason: true,
        cancelCode: 'approval.freelancer-approval.buttons.cancel',
        confirmCode: 'approval.freelancer-approval.buttons.save',
      }
    }).afterClosed().subscribe((res) => {
      if (res) {
        const values = {
          email: res?.reason,
        };
        this.store.dispatch(new fromApprovalAction.SendEmail(values));
        setTimeout(() => {
          this.store.select(fromApproval.getNewFreelancer).subscribe((data: any) => {
            if (data?.data && data.data?.data && data.data.data?.freelancer && data.data.data.freelancer?.data && data.data.data.freelancer.data?.id) {
              // @ts-ignore
              this.router.navigate(['/approval/freelancer-approved', data.data.data.freelancer.data.id]);
            }
          });
        }, 1000);

      }
    });
  }

  send(row: any) {
    // const data = {
    //   id: row.id,
    //   is_approved: true
    // };
    // return this.store.dispatch(new fromApprovalAction.UserEmailVerify(data));
    this.authService.resetPassword({ email: row.email }).subscribe(res => {
      this.toastrService.success(
        this.translateService.instant('approval.freelancer-approval.email-success')
      );
    });
    setTimeout(() => {
    if ( row.email) {
      this.searchModel = { ...this.searchModel, pageIndex: 1};
      this.store.dispatch(new fromApprovalAction.LoadUserList(this.searchModel));
    }
    }, 1000);
  }

  navigateToDetail(row: any) {
    this.router.navigate(['/approval/freelancer-approved', row.id]);
  }

  pageChange(event: any) {
    const pageIndex = event.pageIndex + 1;
    this.searchModel = { ...this.searchModel, page: pageIndex };
    this.store.dispatch(new fromApprovalAction.LoadUserList(this.searchModel));
  }
}
