import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { UserService } from './../../services/user.service';

@Component({
  selector: '[app-approval-comment]',
  templateUrl: './approval-comment.component.html',
  styleUrls: ['./approval-comment.component.scss']
})
export class ApprovalCommentComponent implements OnInit {
  @Input()
  required = false;
  @Input()
  comment: string | undefined;
  @Output() commentChange = new EventEmitter<string>()
  fullname: any;
  date: Date | undefined;
  avatar: any;
  constructor(private userService: UserService) {
    this.date = new Date();
    this.fullname = this.userService.user().name();
    // this.avatar = this.userService.userData && this.userService.userData.av && this.user.avatar();
  }

  ngOnInit(): void {

    // vm.avatar = vm.user.avatar && vm.user.avatar();
  }
  commentUpdated(comment: string | undefined) {
    this.commentChange.emit(comment || '');
  }
}
