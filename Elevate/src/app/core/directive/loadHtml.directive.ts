import { HttpClient } from '@angular/common/http';
import {
  Directive,
  ElementRef,

  Input,
  OnChanges,

  Renderer2,
  SimpleChanges
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { StorageService } from './../../services/storage.service';


@Directive({
  selector: 'div[appLoadHtml]',
})
export class LoadHtmlDirective implements OnChanges {
  @Input()
  appLoadHtml: string | undefined;
  htmlTemplate: string | undefined;
  constructor(
    private renderer: Renderer2,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    private storageService: StorageService,
    private el: ElementRef
  ) {
    // if (path) {
    //   this.renderer.setAttribute(this.el.nativeElement, 'src', path);
    // } else {
    //   this.updateDefaultImage();
    // }
    // this.renderer.setAttribute(this.el.nativeElement, 'src', './assets/icon/loader.svg');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.appLoadHtml) {
      if (this.appLoadHtml) {
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
    fetch(
      `./../../../lang/tpl/${language}/` + this.appLoadHtml + `.${language}.htm`
    ).then((res) => {
      res.text().then((a) => {
        this.el.nativeElement.innerHTML = a;
      });
    });
  }
}
