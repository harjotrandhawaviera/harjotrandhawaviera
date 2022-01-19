import { ExamInstanceResponse, ExamResponse } from './../../model/exam.response';
import { ExamInstanceVM, ExamVM } from './../../model/exam.model';

import { CertificateResponse } from "../../model/certificate.response";
import { CertificateVM } from "../../model/certificate.model";
import { Injectable } from "@angular/core";
import { MultipleResponse } from '../../model/response';
import { PagedResult } from '../../model/pagination.model';

@Injectable()
export class ExamMappingService {
  constructor() {

  }
  examInstanceResponseToVM(response: ExamInstanceResponse): ExamInstanceVM {
    const model: ExamInstanceVM = {
      id: response.id,
      exam_id: response.exam_id,
      created_at: response.created_at,
      updated_at: response.updated_at,
      finished_at: response.finished_at,
      passed: response.passed,
      questions: response.questions,
      questions_ok: response.questions_ok,
      questions_nok: response.questions_nok,
      question_nok_questions: response.question_nok_questions,
    }
    if (response.exam && response.exam.data) {
      model.exam = this.examResponseToVM(response.exam.data);
    }
    return model;
  }
  examResponseToVM(response: ExamResponse): ExamVM {
    const model: ExamVM = {
      id: response.id,
      name: response.name,
      description: response.description,
      is_enabled: response.is_enabled,
      jobCount: response.certificate?.data?.job_count,
      questions: response.questions && response.questions.data ? response.questions.data.map(a => {
        return {
          id: a.id,
          question: a.question,
          answers: a.answers && a.answers.data ? a.answers.data.map(x => {
            return {
              id: x.id,
              answer: x.answer?.slice(7)
            };
          }) : []
        };
      }) : [],
    };
    if (response.certificate && response.certificate.data) {
      model.certificate = this.certificateResponseToVM(response.certificate.data);
    }
    return model;
  }
  certificateResponseToVM(response: CertificateResponse): CertificateVM {
    const certificateVM: CertificateVM = {};
    certificateVM.id = response.id;
    certificateVM.identifier = response.identifier;
    certificateVM.name = response.name;
    certificateVM.name = response.name;
    certificateVM.descriptionShort = response.description && response.description.substring(0, 60) + '...';
    certificateVM.teaser = response.teaser;
    certificateVM.passed = response.exam_result && response.exam_result.passed;
    certificateVM.invalid_at = response.invalid_at;
    certificateVM.state = certificateVM.passed ? (response.invalid_at && new Date(response.invalid_at) <= new Date() ? 'invalid' : 'passed') : response.is_recommended ? 'recommended' : '';
    certificateVM.classes = response.is_exclusive === true ? 'exclusive' : ''
    certificateVM.category = response.category;
    certificateVM.picture_id = response.picture_id;
    certificateVM.training_id = response.training_id;
    certificateVM.exam_id = response.exam_id;
    certificateVM.description = response.description;
    certificateVM.is_recommended = response.is_recommended;
    certificateVM.is_exclusive = response.is_exclusive;
    certificateVM.job_count = response.job_count;
    certificateVM.tenders_count = response.tenders_count;
    certificateVM.tenders_count_all = response.tenders_count_all;
    certificateVM.created_at = response.created_at;
    certificateVM.data = response.data;
    certificateVM.job_count_by_tenders = response.job_count_by_tenders;
    certificateVM.is_enabled = response.is_enabled;
    certificateVM.valid_interval = response.valid_interval ? response.valid_interval.replace('P', '') : response.valid_interval;
    certificateVM.is_legal = response.is_legal;
    certificateVM.passed_at = response.passed_at;

    // certificateVM.exam = response.exam && response.exam.data ? this.examResponseToVM(response.exam.data) : undefined;
    // certificateVM.training = response.training && response.training.data ? this.trainingResponseToVM(response.training.data) : undefined;
    // certificateVM.training = response.training?.data;
    certificateVM.creator = response.creator?.data;
    return certificateVM;
  }
}
