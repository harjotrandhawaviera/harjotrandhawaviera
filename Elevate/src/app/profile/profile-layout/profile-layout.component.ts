import * as fromProfile from './../state/index';
import * as fromProfileAction from './../state/profile.actions';

import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';

import {FreelancerAssignmentVM, FreelancerVM} from '../../model/freelancer.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile-layout',
  templateUrl: './profile-layout.component.html',
  styleUrls: ['./profile-layout.component.scss']
})
export class ProfileLayoutComponent implements OnInit {
  isOnboarding: any;
  profile: FreelancerVM | undefined;
  freelancerAssignment: FreelancerAssignmentVM | undefined;

  constructor(
    private userService: UserService,
    private store: Store<fromProfile.State>,
    private router: Router) { }

  ngOnInit(): void {
    this.isOnboarding = this.userService.user().onboarding();
    this.store.dispatch(
      new fromProfileAction.LoadProfileDetail({ id: this.userService.user().roleId(), mode: '' })
    );
    this.store.dispatch(
      new fromProfileAction.LoadFreelancerAssignment({ id: this.userService.user().roleId(), mode: '' })
    )
    // this.router.events.pipe(
    //   filter((e): e is NavigationEnd => e instanceof NavigationEnd),
    //   map(e => {
    //     this.store.dispatch(
    //       new fromProfileAction.LoadProfileDetail({ id: this.userService.user().roleId(), mode: '' })
    //     );
    //   })
    // ).subscribe();

    this.store
      .pipe(select(fromProfile.getProfileDetail))
      .subscribe((profile) => {
        this.profile = profile;
      });
    this.store
      .pipe(select(fromProfile.getFreelancerAssignment))
      .subscribe((freelancerAssignment) => {
        this.freelancerAssignment = freelancerAssignment;
      });
  }
}
