import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { FormConfig } from '../../constant/forms.constant';
import { UserService } from './../../services/user.service';
import { environment } from './../../../environments/environment';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: '[app-invoice-details-additional], app-invoice-details-additional',
  templateUrl: './invoice-details-additional.component.html',
  styleUrls: ['./invoice-details-additional.component.scss']
})
export class InvoiceDetailsAdditionalComponent implements OnChanges {

  @Input()
  data: any;
  @Input()
  assignments: any[] = [];
  @Input()
  view = ''
  @Input()
  onBehalf = ''
  enabledDocTypes: string[] = [];
  roleId = '';
  role = '';
  contractTypeIdentifier = '';
  images: any[] = [];
  current: any = {};

  constructor(private userService: UserService, private http: HttpClient) {
    this.enabledDocTypes = FormConfig.invoices.preparation.requiredDocumentTypes.freelancer ? [...FormConfig.invoices.preparation.requiredDocumentTypes.freelancer] : [];
    this.roleId = this.userService.user().roleId();
    this.role = this.userService.user().role();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data) {
      this.onDataChanged();
    }
    if (changes.assignments) {
      this.onAssignmentsChanged();
    }
  }
  onDataChanged() {
    if (this.data) {
      // check if questionnaire doc is available
      // hide questionnaire for clients and field even if it is available
      if (!(this.role === 'client' || this.role === 'field') && this.data.questionnaire && this.data.questionnaire.length && !this.enabledDocTypes.includes('questionnaire')) {
        // add it to the list of enabledDocTypes even if it is not
        // required per default
        this.enabledDocTypes.push('questionnaire');
      }
      if (this.data['picture-documentation'] && JSON.stringify(this.current) !== JSON.stringify(this.data['picture-documentation'])) {
        console.log('executed')
        this.current = this.data['picture-documentation'];
        setTimeout(() => {

          const request: any = this.data['picture-documentation'].map((obj: any) => {
            let customHeaders = new HttpHeaders();
            customHeaders = customHeaders.append('Content-Type', obj.mime);
            customHeaders = customHeaders.append('Accept', '*/*');
            return this.http.get(obj.url,
              { responseType: 'blob', headers:  customHeaders}).pipe(
                map(val => {
                  const blobData = URL.createObjectURL(val);
                  return { ...obj, src: blobData };
                }))
          })
          if (request) {
            forkJoin(request).subscribe(res => {
              this.images = res.map((item: any) => {
                return {
                  title: item.appointments.join(),
                  alt: item.originalFilename,
                  thumbImage: item.src
                }
              });
            });
          }
        }, 1000)
      }
    }
  }

  onAssignmentsChanged() {
    if (this.assignments.length) {
      // get contract type from first assignment
      this.contractTypeIdentifier = this.assignments[0]?.contract_type?.identifier;
    }
  }
  // images(type: string) {
  //   return this.data && this.data[type] ? this.data[type].map((item: any) => {
  //     return {
  //       title: item.appointments.join(),
  //       alt: item.originalFilename,
  //       thumbImage: item.url
  //     }
  //   }) : [];
  // }
}
