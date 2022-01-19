import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

import { AssignmentVM } from '../../model/assignment.model';
import { JobVM } from '../../model/job.model';

@Component({
  selector: 'app-custom-properties-value',
  templateUrl: './custom-properties-value.component.html',
  styleUrls: ['./custom-properties-value.component.scss'],
})
export class CustomPropertiesValueComponent implements OnInit {
  @Input() module: string = 'custom';
  @Input() currency: boolean = false;
  @Input() assignment: AssignmentVM | undefined | null = undefined;
  @Input() job: JobVM | undefined | null = undefined;
  hasProperties: boolean = false;
  propertyList: { key: string; value: any }[] = [];
  assignmentProp: any;
  jobProp: any;
  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.assignment) {
      this.hasProperties = false;
      this.assignmentProp = {};
      if (this.assignment) {
        var propertiesObj: any = {};
        if (this.assignment.data && this.assignment.data.length) {
          this.assignment.data.forEach((prop: any) => {
            propertiesObj[prop] = '';
          });
        }
        this.assignmentProp = { ...propertiesObj, ...this.assignment.data };
        if (this.assignmentProp && Object.keys(this.assignmentProp).length) {
          this.hasProperties = true;
        }
      }
      this.propertyList = [];
      for (const key in this.assignmentProp) {
        if (Object.prototype.hasOwnProperty.call(this.assignmentProp, key)) {
          this.propertyList.push({ key: key, value: this.assignmentProp[key] });
        }
      }
    }
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
