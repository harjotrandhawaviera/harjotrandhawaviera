import { AfterViewChecked, AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders, HttpProgressEvent } from '@angular/common/http';

import { DocumentVM } from '../../model/document.model';
import { F } from '@angular/cdk/keycodes';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from './../../services/translate.service';
import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnChanges, AfterViewInit {
  @ViewChild('fileDropRef')
  fileDropRef!: ElementRef;
  @Input()
  type = 'image';
  @Input()
  settings: any;
  @Input()
  onDocumentClick: boolean= false;
  @Input()
  text = '';
  @Input()
  url = '';
  @Input()
  buttonOnly = false;
  @Output()
  documentUploaded = new EventEmitter<DocumentVM>()
  accept: string = 'image/*';
  uploading: {
    file?: string,
    progress?: number,
    done: boolean
  } = {
      done: true
    };
  // @ViewChild('fileDropRef', { static: false }) fileDropEl: ElementRef;
  // @Input() showProgress = false;
  // @Input() allowedMaxFileSelection = 1;
  // @Input() allowedMaxFileSize = 1;
  // @Input() allowedFileExtension = ['jpg', 'jpeg', 'bmp', 'png', 'pdf', 'docx', 'doc', 'ppt', 'pptx'];
  // @Output() errors: EventEmitter<Messages[]> = new EventEmitter<Messages[]>();
  // fileUploadErrors: Messages[] = [];
  // files: FileHandle[] = [];
  // @Input() filesProgress: FileUploadProgressVM[] = [];

  constructor(private http: HttpClient,
    private translateService: TranslateService,
    private renderer:Renderer2,
    private toastrService: ToastrService
  ) { }
  ngAfterViewInit(): void {
    if(this.onDocumentClick){
      console.log("vrfv")
    let el: HTMLElement = this.fileDropRef.nativeElement;
    el.click();
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    // if(this.onDocumentClick){
    //   let event = new MouseEvent('click', {bubbles: true});
    //   this.renderer.invokeElementMethod(
    //       this.fileInput.nativeElement, 'dispatchEvent', [event]);
    //   this.fileDropRef.click()}
  
    if (changes.type) {
      switch (this.type) {
        case 'document': {
          this.accept = 'application/pdf,image/*';
          break;
        }
        case 'pdf-document': {
          this.accept = 'application/pdf';
          break;
        }
        default: {
          this.accept = 'image/*';
        }
      }
    }
  }

  fileBrowseHandler(event: any) {

    if (event.target.files && event.target.files.length) {
      const formData: FormData = new FormData();
      formData.append('file', event.target.files[0], event.target.files[0].name);

      if (this.settings && this.settings.options) {
        for (const key in this.settings.options) {
          if (Object.prototype.hasOwnProperty.call(this.settings.options, key)) {
            const element = this.settings.options[key];
            formData.append(key, element);
          }
        }
      }
      let customHeaders = new HttpHeaders();
      customHeaders = customHeaders.append(
        'Content-Type',
        'multipart/form-data'
      );
      this.uploading.file = event.target.files[0].name;
      this.http.post(environment.api + '/documents', formData,
        {
          headers: customHeaders,
          observe: 'events',
          reportProgress: true
        }).subscribe(res => {
          if (res.type === HttpEventType.Response) {
            // success
            this.uploading.done = true;
            this.toastrService.success(this.translateService.instant('upload.success'));
            // notificationService.success($translate.instant('upload.success'));
            if (res.body) {
              const document = (res.body as any).data as DocumentVM;
              document.name = this.uploading.file;
              this.documentUploaded.emit({ ...document, });
            }
            this.reset();
          } else if (res.type === HttpEventType.UploadProgress) {
            this.uploading.progress = Math.round((100 * res.loaded) / (res as any).total);
          }
        },
          (error: any) => {
            this.toastrService.error(this.translateService.instant('upload.errors.message'));
            this.reset();
          })
    }
  }
  reset() {
    if (this.fileDropRef) {
      this.fileDropRef.nativeElement.value = '';
    }
    this.uploading.progress = 0;
    this.uploading.done = true;
  }
}
