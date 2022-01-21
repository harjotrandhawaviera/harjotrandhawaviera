/* eslint-disable @typescript-eslint/member-ordering */
import { StorageService } from './../../services/storage.service';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-load-html',
  templateUrl: './load-html.component.html',
  styleUrls: ['./load-html.component.scss']
})
export class LoadHtmlComponent implements OnInit, OnChanges {
  @Input()
  template: string | undefined;
  htmlTemplate: string | undefined;
  constructor(private storageService: StorageService) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.template) {
      if (this.template) {
        const language = this.storageService.get('language');
        if (language) {
          this.loadTemplate(language);
        } else {
          this.loadTemplate('de');
        }
      } else {
        this.htmlTemplate = '';
      }

    }

  }

  private loadTemplate(language: string) {
    fetch(`./../../../lang/tpl/${language}/` + this.template + `.${language}.htm`).then(res => {
      res.text().then(a => {
        this.htmlTemplate = a;
      });
    });
  }

  ngOnInit(): void {

  }

}
