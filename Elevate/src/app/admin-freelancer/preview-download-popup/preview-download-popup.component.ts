import {Component, ElementRef, Inject, OnInit, Renderer2} from '@angular/core';
import {HttpClient, HttpEventType, HttpHeaders} from '@angular/common/http';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FileExportService} from '../../services/file-export.service';

@Component({
  selector: 'app-preview-download-popup',
  templateUrl: './preview-download-popup.component.html',
  styleUrls: ['./preview-download-popup.component.scss']
})
export class PreviewDownloadPopupComponent implements OnInit {
  pdf = '';
  image = '';
  temp: any;
  componentActive = true;
  imageToShow: any;

  constructor(private http: HttpClient,
              private fileExportService: FileExportService,
              private renderer: Renderer2,
              private el: ElementRef,
              public dialogRef: MatDialogRef<PreviewDownloadPopupComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.pdf = this.data?.pdf?.url;
    this.image = this.data?.image?.url;
    this.preview();
    this.loadAndSetImage();
  }

  preview() {
    if (this.pdf) {
      let customHeaders = new HttpHeaders();
      customHeaders = customHeaders.append('Content-Type', 'pdf');
      customHeaders = customHeaders.append('Accept', '*/*');
      this.http
        .get(this.pdf, {
          observe: 'events',
          responseType: 'blob',
          headers: customHeaders,
          reportProgress: true,
        }).subscribe(res => {
        if (res.type === HttpEventType.Response) {
          if (res.body) {
            const blob: Blob = new Blob([res.body], {
              type: 'pdf'
            });
            this.temp = URL.createObjectURL(blob);
          }
        }
      });
    }
  }

  loadAndSetImage() {
    if (this.image) {
      fetch(this.image, { headers: {'Content-Type': this.data?.image?.mime, Authorization: 'Bearer ' + localStorage.getItem('token')} })
        .then(response => response.blob())
        .then(result => {
          const reader = new FileReader();
          reader.readAsDataURL(result);
          reader.onloadend = () => {
            const base64data = reader.result;
            this.imageToShow = base64data;
          };
        })
        .catch(error => console.log('error', error));
    }
  }

  download() {
    if(this.image) {
      this.fileExportService.getDownload(
        { url: this.data?.image?.url, fileName: this.data?.image?.original_filename, mimeType: this.data.image.mime });
    }
    else {
      this.fileExportService.getDownload(
        { url: this.data.pdf.url, fileName: this.data.pdf.original_filename, mimeType: this.data.pdf.mime });
    }
  }

}
