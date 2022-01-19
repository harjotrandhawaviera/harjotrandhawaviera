import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: '[app-freelancer-user-identity]',
  templateUrl: './freelancer-user-identity.component.html',
  styleUrls: ['./freelancer-user-identity.component.scss']
})
export class FreelancerUserIdentityComponent implements OnInit {
  @Input()
  data: any;
  constructor() { }

  ngOnInit(): void {
  }

}
