import { Component, Input, OnInit } from '@angular/core';

import { UserApprovalService } from './../../services/user-approval.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: '[app-profile-comment]',
  templateUrl: './profile-comment.component.html',
  styleUrls: ['./profile-comment.component.scss']
})
export class ProfileCommentComponent implements OnInit {
  @Input()
  part = '';
  message = '';
  constructor(private userService: UserService,
    private userApprovalService: UserApprovalService) { }

  ngOnInit(): void {
    if (this.userService.user().onboarding()) {
      this.userApprovalService.getFreelancerApprovals(this.userService.user().roleId()).subscribe((approvals) => {
        this.message = ((approvals.data || {}) as any)[this.part]?.comment || '';
      });
    }
  }

}
