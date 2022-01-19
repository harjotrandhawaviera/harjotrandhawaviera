import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

import { JobVM } from '../../model/job.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-job-tile',
  templateUrl: './client-job-tile.component.html',
  styleUrls: ['./client-job-tile.component.scss'],
})
export class ClientJobTileComponent implements OnInit, OnChanges {
  @Input() clientJob?: JobVM;
  shortTitle?: string;

  constructor(private router: Router) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && this.clientJob) {
      this.shortTitle = this.clientJob.title?.split(' | ')[0];
    }
  }

  ngOnInit(): void {}

  navigateToDetail(job: JobVM) {
    this.router.navigate(['/jobs/client', job.id]);
  }

  navigateToCreateClientJobTender(job: JobVM) {
    this.router.navigate([`/jobs/client/${job.id}/tenders/create`]);
  }
}
