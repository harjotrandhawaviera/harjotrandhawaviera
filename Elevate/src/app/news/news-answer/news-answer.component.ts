import { Component, OnInit } from '@angular/core';
import { OptionVM } from '../../model/option.model';
import { NewsFacade } from '../state/news.facade';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-news-answer',
  templateUrl: './news-answer.component.html',
  styleUrls: ['./news-answer.component.scss']
})
export class NewsAnswerComponent implements OnInit {
  messageAnswer = new FormGroup(
    {
      content: new FormControl()
    }
  );
  message: OptionVM | any;
  constructor(private newsFacade: NewsFacade,
              private router: Router) { }

  ngOnInit(): void {
    this.newsFacade.newsLoading();
    this.newsFacade.getNewsList$.subscribe((res: any) => {
      if (res.data) {
        this.
          message = this.sortOption(
          res.data
            ? res.data.map((a: any) => {
              return {
                subject: a.subject,
              };
            })
            : []
        );
      }
    });
  }
  sortOption(options: OptionVM[]) {
    return options.sort((a: OptionVM, b: OptionVM) =>
      a.text && b.text ? (a.text > b.text ? 1 : b.text > a.text ? -1 : 0) : 0
    );
  }
  sendAnswer(value: any) {
    const postValue = {
      content: this.messageAnswer.get('content')?.value,
      question_id: value.id,
      subject: value.subject,
      tender_ids: value.tenders
    };
    this.newsFacade.sendAnswerValue(Number(value.id), postValue);
    this.router.navigate(['messages', 'jobs']);
  }
}
