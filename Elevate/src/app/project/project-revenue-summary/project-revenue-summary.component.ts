import { RevenueService } from './../../services/revenue.service';
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-project-revenue-summary',
  templateUrl: './project-revenue-summary.component.html',
  styleUrls: ['./project-revenue-summary.component.scss']
})
export class ProjectRevenueSummaryComponent implements OnChanges {

  @Input()
  projectId: string | null | undefined;
  projectSummary: any | undefined;
  expanded = false;
  detail: { key: string, value: any }[] = [];
  constructor(private revenueService: RevenueService) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.projectId) {
      if (this.projectId) {
        this.revenueService.getRevenues({
          limit: 1, filters: [
            { key: 'project', value: this.projectId },
            { key: 'add_summary', value: true }]
        }).subscribe(res => {
          if (res.meta && res.meta.summary) {
            this.projectSummary = res.meta.summary;
          } else {
            this.projectSummary = undefined;
          }
          this.updateSummaryDetail();
        });
      } else {
        this.projectSummary = undefined;
        this.updateSummaryDetail();
      }
    }
  }
  updateSummaryDetail() {
    this.detail = [];
    if (this.projectSummary && this.projectSummary.slots) {
      for (const key in this.projectSummary.slots) {
        if (Object.prototype.hasOwnProperty.call(this.projectSummary.slots, key)) {
          const value = this.projectSummary.slots[key];
          this.detail.push({ key: key, value: value });
        }
      }
    }
  }


}
