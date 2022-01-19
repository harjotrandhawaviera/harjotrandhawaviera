import {
  Attribute,
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Renderer2,
  SimpleChanges
} from '@angular/core';
import { map, takeWhile } from 'rxjs/operators';

import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';

@Directive({
  selector: 'img[appImageAvatar]'
})
export class ImageAvatarDirective implements OnChanges, OnDestroy {
  @Input()
  path: string = '';
  @Input()
  imageId: string | number | undefined | null = '';
  @Input()
  size: string = '';
  @Input()
  defaultPath: string = '';
  @Input()
  showDefault = true;
  componentActive = true;
  defaultAvtar = '../../../assets/images/avatar.png';
  constructor(
    private renderer: Renderer2,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    private el: ElementRef) {
    // if (path) {
    //   this.renderer.setAttribute(this.el.nativeElement, 'src', path);
    // } else {
    //   this.updateDefaultImage();
    // }
    // this.renderer.setAttribute(this.el.nativeElement, 'src', './assets/icon/loader.svg');
  }
  ngOnDestroy(): void {
    this.componentActive = false;
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.path || changes.imageId) {
      if (this.path) {
        this.renderer.setAttribute(this.el.nativeElement, 'src', this.defaultPath ? this.defaultPath : this.showDefault ? this.defaultAvtar : '');
        this.renderer.addClass(this.el.nativeElement, 'loading-image');
        this.loadAndSetImage();
      } else if (this.imageId) {
        this.renderer.setAttribute(this.el.nativeElement, 'src', this.defaultPath ? this.defaultPath : this.showDefault ? this.defaultAvtar : '');
        this.renderer.addClass(this.el.nativeElement, 'loading-image');
        this.loadAndSetImage();
      } else {
        this.updateDefaultImage();
      }
    }
  }
  loadAndSetImage() {
    if (this.path) {
      this.http.get(this.path,
        { responseType: 'blob' })
        .pipe(
          takeWhile(() => this.componentActive),
          map(val => {
            const blobData = URL.createObjectURL(val);
            return blobData;
          })).subscribe(res => {
            this.renderer.setAttribute(this.el.nativeElement, 'src', res);
          });
    } else if (this.imageId) {
      const url = this.imageId ? environment.api + `/pictures/${this.imageId}/${(this.size || 'icon')}/squared` : '';
      this.http.get(url, { responseType: 'blob' })
        .pipe(
          takeWhile(() => this.componentActive),
          map(val => {
            const blobData = URL.createObjectURL(val);
            return blobData;
          })
        ).subscribe(res => {
          this.renderer.setAttribute(this.el.nativeElement, 'src', res);
        })
    }
  }

  @HostListener('load') onLoad() {
    this.renderer.removeClass(this.el.nativeElement, 'loading-image');
    // this.renderer.setAttribute(this.el.nativeElement, 'src', this.el.nativeElement.src);
  }
  @HostListener('error') onError() {
    this.renderer.setAttribute(this.el.nativeElement, 'src', this.defaultPath ? this.defaultPath : this.showDefault ? this.defaultAvtar : '');
  }

  private updateDefaultImage() {
    this.renderer.setAttribute(this.el.nativeElement, 'src', this.defaultPath ? this.defaultPath : this.showDefault ? this.defaultAvtar : '');
  }
}
