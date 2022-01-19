import * as fromProfile from './../state/index';
import * as fromProfileAction from './../state/profile.actions';
import * as fromUser from './../../root-state/user-state';

import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { FormBuilder } from '@angular/forms';
import { FreelancerVM, FreelancerAssignmentVM } from '../../model/freelancer.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

  role: string | undefined;
  roleId: number | undefined;
  id: number | undefined;
  profile: FreelancerVM | undefined;
  freelancerAssignment: FreelancerAssignmentVM | undefined
  isOnboarding$: Observable<boolean | undefined> = of(undefined);
  isOnboarding: boolean | undefined;

  constructor(
    private fb: FormBuilder,
    private userStore: Store<fromUser.State>,
    private store: Store<fromProfile.State>
  ) {}

  ngOnInit(): void {
    this.isOnboarding$ = this.userStore.pipe(select(fromUser.isOnboarding));
    this.isOnboarding$.subscribe((res) => {
      this.isOnboarding = res;
    });
    this.userStore.pipe(select(fromUser.getUserRole)).subscribe((role) => {
      this.role = role;
    });
    this.userStore.pipe(select(fromUser.getUserRoleId)).subscribe((id) => {
      this.id = id;
      if (id) {
        this.store.dispatch(
          new fromProfileAction.LoadProfileDetail({ id, mode: '' })
        );
      }
    });
    this.userStore.pipe(select(fromUser.getUserRoleId)).subscribe((id) => {
      this.id = id;
      if (id) {
        this.store.dispatch(
          new fromProfileAction.LoadFreelancerAssignment({ id, mode: ''})
        );
      }
    });
    this.store
      .pipe(select(fromProfile.getProfileDetail))
      .subscribe((profile) => {
        if (profile) {
          this.profile = profile;
        }
      });
    this.store
      .pipe(select(fromProfile.getFreelancerAssignment))
      .subscribe((freelancerAssignment) => {
        if (freelancerAssignment) {
          this.freelancerAssignment = freelancerAssignment;
        }
      });
  }
}
