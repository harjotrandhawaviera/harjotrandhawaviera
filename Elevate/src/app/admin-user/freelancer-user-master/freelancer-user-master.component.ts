import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { AssetsConfig } from './../../constant/assets.constant';
import { FormConfig } from '../../constant/forms.constant';

@Component({
  selector: '[app-freelancer-user-master]',
  templateUrl: './freelancer-user-master.component.html',
  styleUrls: ['./freelancer-user-master.component.scss']
})
export class FreelancerUserMasterComponent implements OnInit, OnChanges {
  bodyIcon: string = '';
  detailsOptions: any;
  @Input()
  data: any;
  facePlaceholder: string = ''
  bodyPlaceholder: string = '';
  images: any[] = []

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data) {
      if (this.data && this.data.sliderPictures) {
        this.images = this.data.sliderPictures.filter((a: any) => a && a.url && a.url.medium).map((a: any) => {
          return {
            thumbImage: a.url.medium
          }
        });
      }
    }
  }

  constructor() { }

  ngOnInit(): void {
    this.bodyPlaceholder = AssetsConfig.profile.body.f;
    this.facePlaceholder = AssetsConfig.profile.face.f;
    this.bodyIcon = AssetsConfig.profile.bodyIcon.default;
    this.detailsOptions = FormConfig.freelancer.options;
  }

}
