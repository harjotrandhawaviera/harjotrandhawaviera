import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import { ExamInstanceVM } from './../../model/exam.model';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ExamService } from '../../services/exam.service';
import { ExamMappingService } from '../../services/mapping-services/exam-mapping.service';
import { SelectionModel } from '@angular/cdk/collections';
import { F } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-exam-modal',
  templateUrl: './exam-modal.component.html',
  styleUrls: ['./exam-modal.component.scss']
})
export class ExamModalComponent implements OnInit {
  examId: number | undefined = undefined;
  passed = false;
  examInstance: ExamInstanceVM = {};

  activeQuestion = 0;
  error = null;
  step = 'description';
  selection = new SelectionModel<number>(true, []);
  isModel: boolean = false;
  get isActiveSummaryBtn() {
    return this.step === 'questionnaire' && this.examInstance.exam && this.examInstance.exam.questions ?
      this.activeQuestion === this.examInstance.exam.questions.length - 1 : false;
  }
  result: ExamInstanceVM | undefined = undefined;
  constructor(
    @Optional() public dialogRef: MatDialogRef<ExamModalComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private activatedRoute: ActivatedRoute,
    private examService: ExamService,
    private router: Router,
    private examMappingService: ExamMappingService
  ) {
    if (this.data) {
      this.examId = this.data.examId;
    }
  }

  ngOnInit(): void {
    if (this.examId && this.dialogRef) {
      this.isModel = true;
      this.loadExam();
    } else if (!this.dialogRef) {
      this.activatedRoute.params.subscribe(res => {
        if (res.id) {
          this.examId = res.id;
          this.loadExam();
        }
      })
    }
  }
  private loadExam() {
    if (this.examId) {
      this.examService.startExam(this.examId).subscribe(res => {
        if (res.data) {
          this.examInstance = this.examMappingService.examInstanceResponseToVM(res.data);
        }
      });
    }
  }

  startQuestionnaire() {
    this.step = 'questionnaire';
  }
  backToOverview() {
    this.dialogRef.close(this.passed);
  }
  prev() {
    this.activeQuestion = this.activeQuestion - 1;
  }
  next() {
    this.activeQuestion = this.activeQuestion + 1;
  }
  showSummary() {
    this.step = 'summary';
  }
  submit() {
    if (this.examInstance.id) {
      this.examService.submitAnswers({ exam_instance_id: this.examInstance.id, answers: this.selection.selected }).subscribe(res => {
        if (res && res.body && res.body.data) {
          this.result = this.examMappingService.examInstanceResponseToVM(res.body.data);
          this.passed = !!this.result.passed;
          this.step = 'result';
        }
      }, (error) => {
        console.log(error);
        this.error;
      });
    }

  }
  toggleAnswer(id: number) {
    this.selection.toggle(id);
  }
  restartExam() {
    this.activeQuestion = 0;
    this.selection.clear();
    this.result = undefined;
    this.error = null;
    this.step = 'description';
    this.loadExam();
  }
  backToTraining() {
    if (this.dialogRef) {
      this.dialogRef.close(this.passed);
    } else if (this.examInstance.exam && this.examInstance.exam.certificate && this.examInstance.exam.certificate.id) {
      this.router.navigate(['/certificates/details', this.examInstance.exam.certificate.id]);
    }
  }
  closeDialog() {
    if (this.dialogRef) {
      this.dialogRef.close(this.passed);
    } else {
      this.router.navigate(['/certificates/my']);
    }
  }
}
