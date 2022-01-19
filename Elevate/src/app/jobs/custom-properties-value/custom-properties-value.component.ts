import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

import { JobVM } from '../../model/job.model';

@Component({
  selector: 'app-custom-properties-value',
  templateUrl: './custom-properties-value.component.html',
  styleUrls: ['./custom-properties-value.component.scss'],
})
export class CustomPropertiesValueComponent implements OnInit {
  @Input() module: string = 'custom';
  @Input() currency: boolean = false;
  @Input() job: JobVM | undefined | null = undefined;
  hasProperties: boolean = false;
  propertyList: { key: string; value: any }[] = [];
  jobProp: any;
  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.job) {
      this.hasProperties = false;
      this.jobProp = {};
      if (this.job) {
        var propertiesObj: any = {};
        if (
          this.job?.project?.client &&
          this.job.project.client.custom_properties
        ) {
          this.job.project.client.custom_properties.forEach((prop) => {
            propertiesObj[prop] = '';
          });
        }
        this.jobProp = { ...propertiesObj, ...this.job?.project?.data };
        if (this.jobProp && Object.keys(this.jobProp).length) {
          this.hasProperties = true;
        }
      }
      this.propertyList = [];
      for (const key in this.jobProp) {
        if (Object.prototype.hasOwnProperty.call(this.jobProp, key)) {
          this.propertyList.push({ key: key, value: this.jobProp[key] });
        }
      }
    }
  }

  ngOnInit(): void {}
}
