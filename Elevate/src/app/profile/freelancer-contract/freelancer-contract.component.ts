import * as fromProfile from './../state/index';

import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';

import {FreelancerAssignmentVM, FreelancerVM} from '../../model/freelancer.model';

@Component({
  selector: 'app-freelancer-contract',
  templateUrl: './freelancer-contract.component.html',
  styleUrls: ['./freelancer-contract.component.scss']
})
export class FreelancerContractComponent implements OnInit {
  profile: FreelancerVM | undefined;
  freelancerAssignment: FreelancerAssignmentVM | undefined;
  methodOfEngagement:any = [
    "Temporary Employee",
    "Freelance",
    "Agency / Facilitator"
  ]
  constructor(
    private store: Store<fromProfile.State>,
  ) { }

  ngOnInit(): void {
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
  // isCheckboxSelected(id: number | undefined) {
  //   return this.rightsPerRole.some((x) => x.id === id);
  // }

}
