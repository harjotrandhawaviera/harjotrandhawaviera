import * as fromPerformanceReview from '../state/index';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { takeWhile } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as formPerformanceReviewAction from "../state/performance-review.actions";
import { ClientService } from '../../services/client.service';
import { OptionVM } from '../../model/option.model';
import { ProjectService } from '../../services/project.service';
import { JobService } from '../../services/job.service';
import { PerformanceReviewService } from '../../services/performance-review.service';
import { performanceReviewVM } from '../../model/performanceReview.model';
@Component({
  selector: 'app-performance-review-rating',
  templateUrl: './performance-review-rating.component.html',
  styleUrls: ['./performance-review-rating.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PerformanceReviewRatingComponent implements OnInit {
  result$: any;
  componentActive = true;
  searchForm: FormGroup;
  reviewForm: FormGroup;
  clientList: OptionVM[] = [];
  projectLK: OptionVM[] = [];
  jobList: OptionVM[] = [];
  timePeriodList: OptionVM[] = [];
  list: [string, unknown][] = [];
  searchButtonDisable: boolean = true;
  data: any;
  constructor(
    private store: Store<fromPerformanceReview.State>,
    public fb: FormBuilder,
    public reviewFB: FormBuilder,
    private clientService: ClientService,
    private projectService: ProjectService,
    private jobService: JobService,
    private performanceReviewService: PerformanceReviewService
  ) {
    this.searchForm = this.fb.group({
      client: '',
      project: '',
      job: '',
      timePeriod: ''
    })

    this.reviewForm = reviewFB.group({
      rating: '',
      comment: '',
      status: ''
    })
  }

  ngOnInit(): void {
    this.loadClientList();
    this.loadProjectList();
    this.loadJobList();
  }

  loadClientList() {
    this.clientService
      .getClients({
        limit: 1000000,
        order_by: 'name',
        order_dir: 'asc',
        only_fields: ['client.id', 'client.name'],
      })
      .subscribe((res) => {
        this.clientList = res.data
          ? res.data.map((a) => {
            return {
              value: a.id,
              text: a.name,
            };
          })
          : [];
      });
  }

  loadProjectList(id?: number) {
    this.searchButtonDisable = true;
    this.searchForm.get("project")?.patchValue('');
    this.jobList = [];
    this.projectService
    .getProjectsByClientId({
      limit: 1000000,
      order_by: 'name',
      order_dir: 'asc',
      only_fields: ['project.id', 'project.name'],
      filters: []
    }, id).subscribe((res) => {
      this.projectLK = res.data
        ? res.data.map((a) => {
          return {
            value: a.id,
            text: a.name,
          };
        })
        : [];
    });
  }

  loadJobList(id?: number) {
    this.searchButtonDisable = true;
    this.searchForm.get("job")?.patchValue('');
    this.jobService
      .getJobsByProjectId({
        limit: 1000000,
        order_by: 'title',
        order_dir: 'asc',
        only_fields: ['job.id', 'job.title'],
        filters: []
      }, id)
      .subscribe((res) => {
        this.jobList = res.data
          ? res.data.map((a) => {
            return {
              value: a.id,
              text: a.title,
            };
          })
          : [];
      });
  }

  onSelectJob() {
    this.searchButtonDisable = false;
    this.searchForm.get("timePeriod")?.patchValue('');
    this.performanceReviewService.getTimePeriodList().subscribe((res: any) => {
      // this.list = Object.entries(res.time_periods)
      const obj = res.time_periods;
      this.data = Object.entries(obj).map(([name, year], i) => ({
        id: i + 1,
        name,
        year
      }));
    });

  }

  onSearch() {
    let obj = {
      job_id: this.searchForm.value.job,
      time_period: this.searchForm.value.timePeriod
    }
    this.result$ = this.store.pipe(
      select(fromPerformanceReview.getPerformanceReviewModel),
      takeWhile(() => this.componentActive)
    );
    this.store.dispatch(new formPerformanceReviewAction.PerformanceReviewList({performanceReview: obj}));
  }

  onSubmitReview(performaceReview: any) {
    const obj: performanceReviewVM = {
      job_id: performaceReview.job_id,
      freelancer_id: performaceReview.freelancer_id,
      status: this.reviewForm.value.status,
      rating: this.reviewForm.value.rating,
      comment: this.reviewForm.value.comment,
    }
    this.store.dispatch(
      new formPerformanceReviewAction.UpdatePerformanceReview({ performanceReview: obj })
    );
  }

  onClear() {
    this.searchForm.reset();
    this.searchButtonDisable = true;
  }
}
