import { AfterViewInit, Component, ComponentFactoryResolver, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';

import { DomSanitizer } from '@angular/platform-browser';
import { FileExportService } from './../../services/file-export.service';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: '[app-training-content]',
  templateUrl: './training-content.component.html',
  styleUrls: ['./training-content.component.scss']
})
export class TrainingContentComponent implements OnChanges, AfterViewInit {
  @ViewChild('trainingContent') trainingContent!: ElementRef;
  @Input()
  content: any;
  innerContent: any;
  constructor(private http: HttpClient,
    private fileExportService: FileExportService,
    private sanitizer: DomSanitizer, private componentFactoryResolver: ComponentFactoryResolver) { }
  ngAfterViewInit(): void {
    const images = (this.trainingContent.nativeElement).getElementsByTagName('img');
    if (images && images.length > 0) {
      const imageCalls: any[] = [];
      for (let index = 0; index < images.length; index++) {
        const ele = images[index];
        const url = ele.getAttribute('data-src');
        if (url && url.length > 0) {
          imageCalls.push({
            image: ele,
            call: this.http.get(url,
              { responseType: 'blob' })
              .pipe(
                map(val => {
                  const blobData = URL.createObjectURL(val);
                  return blobData;
                }))
          })
        }
      }
      forkJoin(imageCalls.map(a => a.call)).subscribe(res => {
        for (let index = 0; index < res.length; index++) {
          const source: any = res[index];
          (imageCalls[index].image as HTMLElement).setAttribute('src', source);
        }
      });
    }
    const anchors = (this.trainingContent.nativeElement).getElementsByTagName('a');
    if (anchors && anchors.length > 0) {
      for (let index = 0; index < anchors.length; index++) {
        const ele = anchors[index];
        (ele as HTMLElement).className = "mat-focus-indicator mat-stroked-button mat-button-base mat-primary"
        const docUrl = ele.getAttribute('data-download');
        const docName = ele.getAttribute('download');
        if (docUrl) {
          (ele as HTMLElement).addEventListener('click', () => {
            this.fileExportService.getDownload({ url: docUrl, fileName: docName, mimeType: 'pdf' });
          });
        }
      }
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.content) {
      if (this.content) {
        this.content = this.content.replace(/<a (.*?)href="\/documents\//g, '<a $1 data-download="' + environment.api + '/documents/');
        this.content = this.content.replace(/<img (.*?)src="\/pictures\//g, '<img $1 data-src="' + environment.api + '/pictures/');
        this.innerContent = this.sanitizer.bypassSecurityTrustHtml(this.content);
      }
    }
  }
}
