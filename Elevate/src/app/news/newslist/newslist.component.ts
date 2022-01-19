import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { OptionVM } from '../../model/option.model';
import { Observable, of } from 'rxjs';
import { NewsFacade } from '../state/news.facade';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '../../services/translate.service';
import { ReasonBoxComponent } from '../../core/reason-box/reason-box.component';
import { NewsAnswerComponent } from '../news-answer/news-answer.component';

@Component({
  selector: 'app-newslist',
  templateUrl: './newslist.component.html',
  styleUrls: ['./newslist.component.scss']
})
export class NewslistComponent implements OnInit {
  totalRecords$: Observable<number | undefined> = of(undefined);
  currentPage$: Observable<number | undefined> = of(undefined);
  pageSize$: Observable<number | undefined> = of(undefined);
  loading$: Observable<boolean> = of(false);
  noRecords$: Observable<boolean> = of(false);
  newsForm = new FormGroup({
    client: new FormControl(),
    jobs: new FormControl(),
    freelancer: new FormControl(),
    search: new FormControl()
  });
  agentList: OptionVM | any;
  jobList: OptionVM | any;
  freelancer: OptionVM | any;
  message: OptionVM | any;
  searchModel: any = {};
  paginator: any;
  hasFilter = false;
  constructor( private newsFacade: NewsFacade, private dialog: MatDialog,
               private translateService: TranslateService) {
  }
  ngOnInit(): void {
    this.newsFacade.agentLoad();
    this.newsFacade.job();
    this.newsFacade.freelancersLoad();
    this.newsFacade.newsList();
    this.newsFacade.getAgentList$.subscribe((res: any) => {
      if (res.data) {
        this.agentList = this.sortOption(
          res.data
            ? res.data.map((a: any) => {
              return {
                value: a.id,
                text: a.firstname + ' ' + a.lastname,
              };
            })
            : []
        );
      }
    });

    this.newsFacade.getNewsJobs$.subscribe((res: any) => {
      if (res.data) {
        this.jobList = this.sortOption(
          res.data
            ? res.data.map((a: any) => {
              return {
                value: a.id,
                text: a.title
              };
            })
            : []
        );
      }
    });

    this.newsFacade.getFreelancersList$.subscribe((res: any) => {
      if (res.data) {
        this.
          freelancer = this.sortOption(
          res.data
            ? res.data.map((a: any) => {
              return {
                value: a?.user?.data?.id,
                text: a?.lastname + ' ' + a?.firstname,
                info: a?.zip + ' ' + a?.city,
              };
            })
            : []
        );
      }
    });

    this.newsForm.get('client')?.valueChanges.subscribe((res) => {
      this.newsFacade.newsList({ agent_id: res });
    });
    this.newsForm.get('jobs')?.valueChanges.subscribe((res) => {
      const agentId = this.newsForm.get('client')?.value;
      this.newsFacade.newsList({agent_id: agentId , job_id: res});
    });
    this.newsForm.get('freelancer')?.valueChanges.subscribe((res) => {
      const agentId = this.newsForm.get('client')?.value;
      const jobId = this.newsForm.get('jobs')?.value;
      this.newsFacade.newsList({agent_id: agentId, job_id: jobId, sender_id: res});
    });
    this.newsForm.get('search')?.valueChanges.subscribe((res) => {
      const agentId = this.newsForm.get('client')?.value;
      const jobId = this.newsForm.get('jobs')?.value;
      const senderId = this.newsForm.get('freelancer')?.value;
      if ((res && res.length > 2) || !res) {
        const search = this.newsForm.get('search')?.value;
        this.newsFacade.newsList({agent_id: agentId, job_id: jobId, search, sender_id: senderId });
      }
    });
    this.newsFacade.getNewsList$.subscribe((res: any) => {
      if (res?.data?.length > 0) {
        this.hasFilter = false;
      }
      else {
        this.hasFilter = true;
      }
      if (res.data) {
        this.
          message = this.sortOption(
          res.data
            ? res.data.map((a: any) => {
              return {
                q_id: a.id,
                subject: a.subject,
                name: a?.sender?.data?.freelancer?.data?.fullname,
                value: a.content,
                created: a?.created_at,
                email: a?.sender?.data?.email,
                receiver: a?.recipient?.data?.agent?.data?.fullname,
                senderUserId: a?.sender_user_id,
                tender_date: a?.tenders,
                jobId: a?.reference_id,
                tenders: a?.tenders.map((res1: any) => res1.id)
              };
            })
            : []
        );
        if ('data' in res) {
          this.paginator = res?.meta?.pagination;
          }
      }
    });
  }

  sortOption(options: OptionVM[]) {
    return options.sort((a: OptionVM, b: OptionVM) =>
      a.text && b.text ? (a.text > b.text ? 1 : b.text > a.text ? -1 : 0) : 0
    );
  }

  pageChange($event: any) {
    const agentId = this.newsForm.get('client')?.value;
    const sanderId = this.newsForm.get('freelancer')?.value;
    const jobId = this.newsForm.get('jobs')?.value;
    const update: any = {
      pageSize: $event.pageSize,
      pageIndex: $event.pageIndex + 1,
      client_id: agentId,
      sender_id: sanderId,
      jobs_id: jobId,
    };
    this.newsFacade.newsList(update);
  }

  OpenModal(qId: number) {
    const dialogRef = this.dialog.open(ReasonBoxComponent, {
      data: {
        type: 'warning',
        title: this.translateService.instant(
          'messages.jobs.table.remove.title'
        ),
        message: this.translateService.instant(
          'messages.jobs.table.remove.message'
        ),
        cancelCode: 'todos.buttons.cancel',
        confirmCode: 'messages.jobs.table.actions.remove',
      },
    }).afterClosed().subscribe((res) => {
      if(res) {
        this.newsFacade.removeTender(qId);
      }
    });
  }

  confirmModal(subject: string, jobId: number, qId: number, tenders: any) {
    this.dialog.open(ReasonBoxComponent, {
      data: {
        type: 'warning',
        title: this.translateService.instant(
            'messages.jobs.table.actions.answer'
        ),
        message: this.translateService.instant(
            'messages.jobs.table.answer.message' , { subject }
        ),
        label: 'messages.jobs.table.answer.placeholder',
        needReason: true,
        cancelCode: 'job.buttons.cancel',
        confirmCode: 'common.buttons.yes-submit',
      }
    }).afterClosed().subscribe((res) => {
      const params = { content: res.reason, question_id: qId, subject:
          this.translateService.instant('messages.jobs.table.answer.message' , { subject }), tender_ids: tenders}
      this.newsFacade.sendAnswerValue(jobId, params);
      this.newsFacade.getSendAns$.subscribe((newsList: any) => {
        if (newsList.data) {
          this.newsFacade.removeTender(qId);
        }
      });
    });
  }
}
