import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-form-notification',
  templateUrl: './form-notification.component.html',
  styleUrls: ['./form-notification.component.scss']
})
export class FormNotificationComponent implements OnInit {
  @Input()
  type: string = '';
  @Input()
  notifications: any[] = [];
  @Input()
  actions: any[] = [];
  constructor() { }

  ngOnInit(): void {
  }

}
