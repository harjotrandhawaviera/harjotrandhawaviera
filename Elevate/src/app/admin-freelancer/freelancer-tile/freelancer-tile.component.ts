import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { FreelancerVM } from './../../model/freelancer.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-freelancer-tile',
  templateUrl: './freelancer-tile.component.html',
  styleUrls: ['./freelancer-tile.component.scss'],
})
export class FreelancerTileComponent implements OnInit {
  @Input()
  freelancer: FreelancerVM | undefined;
  @Input()
  canDelete: boolean | null = false;
  @Output() delete = new EventEmitter<FreelancerVM>();
  constructor(private router: Router) { }

  ngOnInit(): void { }
  gotoDetail() {
    if (this.freelancer && this.freelancer.user) {
      if (this.freelancer.user && this.freelancer.user.status === 'onboarding') {
        // $state.go('^.profile', {freelancerId: item.id});
        this.router.navigate(['/administration/freelancers/profile', this.freelancer.id]);
        return;
      }
      this.router.navigate(['/administration/freelancers', this.freelancer.user.id]);
    }

  }
  deleteFreelancer() {
    if (this.freelancer && this.freelancer.id) {
      this.delete.emit(this.freelancer);
    }
  }
}
