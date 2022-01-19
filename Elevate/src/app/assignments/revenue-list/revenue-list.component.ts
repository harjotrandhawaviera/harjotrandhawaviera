import * as moment from 'moment';

import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

import { TranslateService } from '../../services/translate.service';

@Component({
  selector: 'app-revenue-list',
  templateUrl: './revenue-list.component.html',
  styleUrls: ['./revenue-list.component.scss'],
})
export class RevenueListComponent implements OnInit, OnChanges {
  @Input() revenue: any | undefined;
  @Input() count: number | undefined;
  @Input() appointedAt: number | undefined;
  @Input() showDetails: boolean | undefined;
  @Input() hasCreator: boolean | undefined;
  @Output() onDetailClick = new EventEmitter();

  creatorName: string | undefined;
  createdAt: string | undefined;
  updatorName: string | undefined;
  warning: boolean = false;
  total: number | undefined;

  constructor(private translateService: TranslateService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && this.revenue) {
      this.translateService.get('common').subscribe((p) => {
        this.creatorName = this.revenue.creator
          ? this.translateService.instant(
              'common.labels.user.' + this.revenue.creator.data.role,
              this.revenue.creator.data
            )
          : this.translateService.instant('common.labels.user.system');

        this.updatorName =
          this.revenue.updator &&
          this.translateService.instant(
            'common.labels.user.' + this.revenue.updator.data.role,
            this.revenue.updator.data
          );
      });

      this.createdAt = moment
        .utc(this.revenue.created_at)
        .toDate()
        .toLocaleDateString();

      this.warning = this.revenue.average > this.revenue.warning_threshold;
      this.total = this.revenue.total || 0;
    }
  }

  ngOnInit(): void {}

  showRevenueDetail(val: string) {
    this.onDetailClick.emit(val);
  }
}
