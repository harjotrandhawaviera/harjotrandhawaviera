import { TranslateService } from './../../services/translate.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmBoxComponent } from '../../core/confirm-box/confirm-box.component';
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-profile-gtc-documents-modal',
  templateUrl: './profile-gtc-documents-modal.component.html',
  styleUrls: ['./profile-gtc-documents-modal.component.scss']
})
export class ProfileGtcDocumentsModalComponent implements OnInit {
  gtcDoc: any;
  pdfUrl: any;
  pdfBlobUrl: any;

  constructor(
    public dialogRef: MatDialogRef<ProfileGtcDocumentsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private translateService: TranslateService,
    private http: HttpClient
  ) {
    if (data) {
      if (data.gtcDoc) {
        this.gtcDoc = data.gtcDoc;
      }
      if (data.pdfUrl) {
        this.pdfUrl = data.pdfUrl; //data.pdfUrl;
        let customHeaders = new HttpHeaders();
        customHeaders = customHeaders.append('Content-Type', 'pdf');
        customHeaders = customHeaders.append('Accept', '*/*');
        this.http
          .get(data.pdfUrl, {
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
                this.pdfBlobUrl = URL.createObjectURL(blob);
              }
            }
          })
      }
    }
  }

  ngOnInit(): void {
  }
  accept() {
    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      data: {
        type: 'warning',
        title: this.translateService.instant('profile.gtc.documents.confirm.title'),
        message: this.translateService.instant('profile.gtc.documents.confirm.message', { name: this.gtcDoc.name }),
        cancelCode: 'profile.gtc.cancel',
        confirmCode: 'profile.gtc.approve',
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      this.dialogRef.close(res);
    })
  }
  download() {

  }
}
