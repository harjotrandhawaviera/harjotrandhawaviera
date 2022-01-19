import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { CertificateService } from './../../services/certificate.service';
import { CertificateVM } from '../../model/certificate.model';
import { DomSanitizer } from '@angular/platform-browser';
import { ExamModalComponent } from './../../exam/exam-modal/exam-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';

@Component({
  selector: '[app-profile-certificate]',
  templateUrl: './profile-certificate.component.html',
  styleUrls: ['./profile-certificate.component.scss']
})
export class ProfileCertificateComponent implements OnInit, OnChanges {
  @Input()
  certificate: CertificateVM | undefined;
  @Input()
  readonly = false;
  audit = {}
  @Output() examPassed = new EventEmitter();
  @Input()
  onBehalf: any;
  @Input()
  invalidExamResult = false;
  passed = false;
  profileView = 'set';
  trainingContent: any;
  constructor(private sanitizer: DomSanitizer,
    public dialog: MatDialog,
    public certificateService: CertificateService,
    public userService: UserService) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.certificate) {
      if (this.certificate && this.certificate.training && this.certificate.training.content) {
        this.trainingContent = this.sanitizer.bypassSecurityTrustHtml(this.certificate.training.content);
      }
      this.getResults();
    }
  }

  private getResults() {
    this.certificateService.getFreelancerAudits(this.userService.user().is('freelancer') ? this.userService.user().roleId() : this.onBehalf).subscribe(res => {
      var audit = res.data.find((a: any) => a.exam_id === this.certificate?.exam_id);
      this.passed = audit && audit.exam_result && audit.exam_result.passed ? true : false;
      this.audit = audit;
      if (this.passed) {
        this.examPassed.emit();
      }
    });
  }

  ngOnInit(): void {

  }
  openModal() {
    const dialogRef = this.dialog.open(ExamModalComponent, {
      data: {
        examId: this.certificate?.exam_id
      },
      width: '80vw',
      height: '80vh'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getResults();
    });
  }
}
