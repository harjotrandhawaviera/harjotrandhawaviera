import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

import { AssignmentService } from '../../services/assignment.service';
import { RatingsResponse } from '../../model/ratings.response';

@Component({
  selector: 'app-assignment-ratings, [app-assignment-ratings]',
  templateUrl: './assignment-ratings.component.html',
  styleUrls: ['./assignment-ratings.component.scss'],
})
export class AssignmentRatingsComponent implements OnInit, OnChanges {
  @Input() assignmentIds: any;
  @Input() criterias: string[] | undefined;
  @Input() freelancerId: number | undefined;
  @Input() viewType: string | undefined;

  hasProperties: boolean = false;
  assignmentRatings: RatingsResponse[] | undefined;
  ratingProp: any[] = [];

  constructor(private assignmentService: AssignmentService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.assignmentIds) {
      this.assignmentService
        .getAssignmentRatings(this.assignmentIds[0])
        .subscribe((res) => {
          this.assignmentRatings = res.data;

          if (this.criterias && this.assignmentRatings) {
            const criteriasArr: any = [];
            this.criterias.forEach((criteria: any) => {
              criteriasArr.push({ key: criteria, value: 0 });
            });

            const ratingArray: any = [];
            this.assignmentRatings.forEach((a) => {
              ratingArray.push({ key: a.criteria, value: a.value });
            });

            this.ratingProp = [...ratingArray, ...criteriasArr];

            const exist = new Set();
            this.ratingProp = this.ratingProp.filter((el) => {
              const duplicate = exist.has(el.key);
              exist.add(el.key);
              return !duplicate;
            });

            this.hasProperties = this.ratingProp && this.ratingProp.length > 0;
          }
        });
    }
  }

  ngOnInit(): void {}
}
