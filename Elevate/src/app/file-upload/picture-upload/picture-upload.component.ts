import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';

import { DocumentVM } from '../../model/document.model';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '../../services/translate.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-picture-upload',
  templateUrl: './picture-upload.component.html',
  styleUrls: ['./picture-upload.component.scss']
})
export class PictureUploadComponent implements OnChanges {
  @Input()
  type = 'image';
  @Input()
  settings: any;
  @Input()
  text = '';
  @Input()
  url = '';
  @Output()
  pictureUploaded = new EventEmitter<DocumentVM>();
  accept: string = 'image/*';
  uploading: {
    file?: string;
    progress?: number;
    done: boolean;
  } = {
    done: true,
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

  constructor(
    private http: HttpClient,
    private translateService: TranslateService,
    private toastrService: ToastrService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
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
      formData.append(
        'file',
        event.target.files[0],
        event.target.files[0].name
      );

      if (this.settings && this.settings.options) {
        for (const key in this.settings.options) {
          if (
            Object.prototype.hasOwnProperty.call(this.settings.options, key)
          ) {
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
      this.http
        .post(environment.api + '/pictures', formData, {
          headers: customHeaders,
          observe: 'events',
          reportProgress: true,
        })
        .subscribe(
          (res) => {
            if (res.type === HttpEventType.Response) {
              // success
              this.uploading.done = true;
              this.toastrService.success(
                this.translateService.instant('upload.success')
              );
              // notificationService.success($translate.instant('upload.success'));
              if (res.body) {
                const document = (res.body as any).data as DocumentVM;
                document.name = this.uploading.file;
                this.pictureUploaded.emit({ ...document });
              }
              this.reset();
            } else if (res.type === HttpEventType.UploadProgress) {
              this.uploading.progress = Math.round(
                (100 * res.loaded) / (res as any).total
              );
            }
          },
          (error: any) => {
            this.toastrService.error(
              this.translateService.instant('upload.error.message')
            );
          }
        );
    }
  }
  reset() {
    this.uploading.progress = 0;
    this.uploading.done = true;
  }
}
