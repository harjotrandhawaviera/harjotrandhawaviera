import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

import { AssetsConfig } from '../../constant/assets.constant';

@Component({
  selector: 'app-logo-brand',
  templateUrl: './logo-brand.component.html',
  styleUrls: ['./logo-brand.component.scss']
})
export class LogoBrandComponent implements OnInit {
  @Input() maxHeight: string | undefined;
  @Input() width: string | undefined;
  @Input() link: string | undefined;
  logoPath: string;
  constructor() {
    this.logoPath = AssetsConfig.brand.logo;
  }

  ngOnInit(): void {}
}
