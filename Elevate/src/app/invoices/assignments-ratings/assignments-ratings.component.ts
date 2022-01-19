import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

import { AssignmentService } from '../../services/assignment.service';
import { RatingsResponse } from '../../model/ratings.response';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from './../../services/translate.service';

@Component({
  selector: '[app-assignments-ratings]',
  templateUrl: './assignments-ratings.component.html',
  styleUrls: ['./assignments-ratings.component.scss']
})
export class AssignmentsRatingsComponent implements OnInit, OnChanges {
  @Input() assignmentIds: any;
  @Input() criterias: string[] | undefined;
  @Input() freelancerId: number | undefined;
  @Input() viewType: string | undefined;

  hasProperties: boolean = false;
  assignmentRatings: RatingsResponse[] | undefined;
  ratingProp: any[] = [];
  hasValues = false;
  data: { [key: string]: { comment: string, value: number } } | undefined;
  constructor(
    private assignmentService: AssignmentService,
    private toastrService: ToastrService,
    private translateService: TranslateService
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.assignmentIds) {
      this.init();
    }
  }

  ngOnInit(): void {
  }
  init() {
    if (this.assignmentIds && this.assignmentIds.length && this.assignmentIds.length > 0) {
      this.assignmentService
        .getAssignmentRatings(this.assignmentIds[0])
        .subscribe((res) => {
          const data: any = {};
          (res.data || []).forEach((rating) => {
            if (rating.criteria) {
              data[rating.criteria] = {
                value: rating.value,
                comment: rating.comment
              };
            }
          });
          // merge properties into given data object
          if (this.criterias && this.criterias.length > 0) {
            const criterias: any = {};
            this.criterias.forEach((key) => {
              criterias[key] = { comment: '', value: 0 };
            });
            this.data = { ...criterias, ...(data || {}) };
          }
          this.hasProperties = !!(this.data && Object.keys(this.data).length);
          this.onRatingChanged();
        });
    }

  }
  submit() {
    const obj = { assignment_ids: this.assignmentIds, freelancer_id: this.freelancerId, rating: this.prepareRatings() }
    this.assignmentService.submitRatings(obj).subscribe(res => {
      this.toastrService.success(this.translateService.instant('notification.put.assignments-ratings.success'))
    }, error => {
      this.toastrService.error(this.translateService.instant('notification.put.assignments-ratings.error'))
    });
  }
  prepareRatings() {
    const data = [];
    for (const key in this.data) {
      if (Object.prototype.hasOwnProperty.call(this.data, key)) {
        const obj = this.data[key];
        if (obj.value > 0) {
          data.push({
            criteria: key,
            value: obj.value,
            comment: obj.comment
          });
        }
      }
    }
    return data;
  }
  onRatingChanged() {
    this.hasValues = !!(this.hasProperties && this.data && Object.keys(this.data).some((rating) => {
      return (this.data && this.data[rating].value && this.data[rating].value > 0);
    }));
  }
}
