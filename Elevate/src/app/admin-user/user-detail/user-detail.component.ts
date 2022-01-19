import * as fromCurrentUser from './../../root-state/user-state';
import * as fromUser from './../state';
import * as fromUserAction from './../state/user.actions';

import { ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { RightsVM, UserVM } from '../models/user.model';
import { Store, select } from '@ngrx/store';
import { take, takeWhile } from 'rxjs/operators';

import { AllowedActions } from '../../constant/allowed-actions.constant';
import { MatDialog } from '@angular/material/dialog';
import { ReasonBoxComponent } from '../../core/reason-box/reason-box.component';
import { TranslateService } from './../../services/translate.service';
import { UserMappingService } from '../services/user-mapping.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit {
  componentActive = true;
  id?: string | null;

  ratingPermission$: Observable<boolean> = of(false);
  disableUserPermission$: Observable<boolean> = of(false);
  deactivateFreelancerPermission$: Observable<boolean> = of(false);
  deactivateUserPermission$: Observable<boolean> = of(false);
  user$: Observable<UserVM | undefined> = of(undefined);
  blocker$: Observable<UserVM | undefined> = of(undefined);
  user: UserVM | undefined = undefined;
  loggedInUser$: Observable<UserVM | null> = of(null);
  loggedInUser: UserVM | undefined = undefined;
  rights: RightsVM[] = [];
  backTo = '';
  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private translateService: TranslateService,
    private userStore: Store<fromCurrentUser.State>,
    private store: Store<fromUser.State>,
    private userMappingService: UserMappingService,
    private usersService: UsersService
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(res => {
      this.backTo = res.backTo;
    })
    this.retrieveIdFromParameters();
    this.getRights();
    this.user$ = this.store.pipe(
      select(fromUser.getUserDetail),
      takeWhile(() => this.componentActive)
    );
    this.blocker$ = this.store.pipe(
      select(fromUser.getBlockedByUser),
      takeWhile(() => this.componentActive)
    );
    this.user$.subscribe((res) => {
      this.user = res;
      if (this.user?.deactivated_by) {
        this.store.dispatch(
          new fromUserAction.LoadBlockedByUser(this.user.deactivated_by)
        );
      } else if (this.user?.disabled_by) {
        this.store.dispatch(
          new fromUserAction.LoadBlockedByUser(this.user.disabled_by)
        );
      } else {
        this.store.dispatch(new fromUserAction.LoadBlockedByUserFailed(null));
      }
    });
    this.ratingPermission$ = this.userStore.pipe(
      select(fromCurrentUser.isAllowed, {
        permissions: AllowedActions['manage-ratings'],
      }),
      takeWhile(() => this.componentActive)
    );
    this.disableUserPermission$ = this.userStore.pipe(
      select(fromCurrentUser.isAllowed, {
        permissions: AllowedActions['disable-users'],
      }),
      takeWhile(() => this.componentActive)
    );
    this.deactivateUserPermission$ = this.userStore.pipe(
      select(fromCurrentUser.isAllowed, {
        permissions: AllowedActions['deactivate-users'],
      }),
      takeWhile(() => this.componentActive)
    );
    this.deactivateFreelancerPermission$ = this.userStore.pipe(
      select(fromCurrentUser.isAllowed, {
        permissions: AllowedActions['deactivate-freelancers'],
      }),
      takeWhile(() => this.componentActive)
    );

    this.loggedInUser$ = this.userStore.pipe(
      select(fromCurrentUser.getCurrentUserInfo),
      takeWhile(() => this.componentActive)
    );

    this.loggedInUser$.subscribe((res) => {
      this.loggedInUser = res ? res : undefined;
    });
  }

  retrieveIdFromParameters() {
    this.route.paramMap.pipe(take(1)).subscribe((params) => {
      this.loadDetail(params);
    });
  }

  loadDetail(params: ParamMap) {
    if (params && params.get('id')) {
      this.id = params.get('id');
      if (this.id) {
        this.store.dispatch(new fromUserAction.LoadUserDetail(this.id));
      }
    }
  }

  getRights() {
    this.usersService.getRights({}).subscribe((res) => {
      this.rights = this.userMappingService.RightsResponseToVM(res);
    });
  }

  isCheckboxSelected(identifier: string | undefined) {
    return this.user?.rights?.some((x) => x === identifier);
  }

  deactivate() {
    const dialogRef = this.openDialogBox('deactivate', true);

    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.id) {
        this.store.dispatch(
          new fromUserAction.DeactivateUser({
            id: this.id,
            reason: result.reason,
          })
        );
      }
    });
  }

  activate() {
    const dialogRef = this.openDialogBox('reactivate', false);

    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.id) {
        this.store.dispatch(new fromUserAction.ActivateUser(this.id));
      }
    });
  }

  disable() {
    const dialogRef = this.openDialogBox('disable', true);

    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.id) {
        this.store.dispatch(
          new fromUserAction.DisableUser({ id: this.id, reason: result.reason })
        );
      }
    });
  }

  enable() {
    const dialogRef = this.openDialogBox('enable', false);

    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.id) {
        this.store.dispatch(new fromUserAction.EnableUser(this.id));
      }
    });
  }

  openDialogBox(type: string, needReason: boolean) {
    return this.dialog.open(ReasonBoxComponent, {
      data: {
        title: this.translateService.instant(`administration.users.${type}.title`),
        message: this.translateService.instant(`administration.users.${type}.message`, {
          fullname: this.user?.fullname,
        }),
        label: this.translateService.instant(`administration.users.${type}.fieldLabel`),
        placeholder: this.translateService.instant(`administration.users.${type}.placeholder`),
        type: 'warning',
        needReason: needReason,
        cancelCode: 'common.buttons.cancel',
        confirmCode: `common.buttons.yes-${type}`,
      },
    });
  }
}
