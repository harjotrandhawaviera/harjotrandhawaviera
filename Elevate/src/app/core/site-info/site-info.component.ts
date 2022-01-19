import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-site-info, [app-site-info]',
  templateUrl: './site-info.component.html',
  styleUrls: ['./site-info.component.scss']
})
export class SiteInfoComponent implements OnInit {
  @Input()
  data: any;
  @Input()
  showPhone = false;
  constructor() { }

  ngOnInit(): void {
  }

}
