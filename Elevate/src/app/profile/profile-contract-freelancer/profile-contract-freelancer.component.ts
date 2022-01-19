import * as fromProfile from './../state/index';

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { FreelancerVM, FreelancerAssignmentVM } from '../../model/freelancer.model';

@Component({
  selector: 'app-profile-contract-freelancer',
  templateUrl: './profile-contract-freelancer.component.html',
  styleUrls: ['./profile-contract-freelancer.component.scss']
})
export class ProfileContractFreelancerComponent implements OnInit {
  profile: FreelancerVM | undefined;
  freelancerAssignment: [] | undefined;
  @Output() freelancerValue = new EventEmitter();

  constructor(
    private store: Store<fromProfile.State>,
  ) { }

  ngOnInit(): void {
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
        // this.freelancerAssignment = freelancerAssignment;
      });
  }

  freelancerContract(value: any) {
    this.freelancerValue.emit(value);
  }
}
