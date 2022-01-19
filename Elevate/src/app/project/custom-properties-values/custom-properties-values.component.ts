import { ProjectVM } from './../../model/project.model';
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-custom-properties-values',
  templateUrl: './custom-properties-values.component.html',
  styleUrls: ['./custom-properties-values.component.scss']
})
export class CustomPropertiesValuesComponent implements OnChanges {
  @Input()
  module: string = 'custom'
  @Input()
  currency: boolean = false;
  @Input()
  project: ProjectVM | undefined | null = undefined;
  hasProperties: boolean = false;
  propertyList: { key: string, value: any }[] = [];
  projProp: any;
  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.project) {
      this.hasProperties = false;
      this.projProp = {};
      if (this.project) {

        var propertiesObj: any = {};
        if (this.project.client && this.project.client.custom_properties) {
          this.project.client.custom_properties.forEach(prop => {
            propertiesObj[prop] = '';
          });
        }
        this.projProp = { ...propertiesObj, ...this.project.data };
        if (this.projProp && Object.keys(this.projProp).length) {
          this.hasProperties = true;
        }
      }
      this.propertyList = [];
      for (const key in this.projProp) {
        if (Object.prototype.hasOwnProperty.call(this.projProp, key)) {
          this.propertyList.push({ key: key, value: this.projProp[key] });
        }
      }
    }
  }

  ngOnInit(): void {
  }

}
