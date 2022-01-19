import { CertificateSearchVM, CertificateVM } from '../../model/certificate.model';

import { CertificateResponse } from '../../model/certificate.response';
import { ExamResponse } from '../../model/exam.response';
import { ExamVM } from '../../model/exam.model';
import { Injectable } from '@angular/core';
import { MultipleResponse } from '../../model/response';
import { PagedResult } from '../../model/pagination.model';
import { SearchRequestVM } from '../../model/search.model';
import { TrainingResponse } from './../../model/exam.response';
import { TrainingVM } from './../../model/exam.model';

@Injectable()
export class CertificateMappingService {
  constructor() {

  }

  certificateMultipleResponseToVM(response: MultipleResponse<CertificateResponse>): PagedResult<CertificateVM> {
    const obj: PagedResult<CertificateVM> = {
      pageInfo: { ...response.meta?.pagination },
      list: []
    };
    if (response.data?.length) {
      response.data.forEach(item => {
        const certificate: CertificateVM = this.certificateResponseToVM(item);
        obj.list.push(certificate);
      });
    }
    return obj;
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
    certificateVM.classes = response.is_exclusive === true ? 'exclusive' : '';
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

    certificateVM.exam = response.exam && response.exam.data ? this.examResponseToVM(response.exam.data) : undefined;
    certificateVM.training = response.training && response.training.data ? this.trainingResponseToVM(response.training.data) : undefined;
    // certificateVM.training = response.training?.data;
    certificateVM.creator = response.creator?.data;
    return certificateVM;
  }
  trainingResponseToVM(response: TrainingResponse): TrainingVM {
    const model: TrainingVM = {
    };
    model.id = response.id;
    model.name = response.name;
    model.description = response.description;
    model.content = response.content;
    model.is_enabled = response.is_enabled;
    model.exam_id = response.exam_id;
    return model;
  }
  examResponseToVM(response: ExamResponse): ExamVM {
    const model: ExamVM = {
      id: response.id,
      name: response.name,
      description: response.description,
      is_enabled: response.is_enabled,
      minimum_percent: response.minimum_percent,
      questions: response.questions && response.questions.data ? response.questions.data.map(a => {
        return {
          id: a.id,
          question: a.question,
          answers: a.answers && a.answers.data ? a.answers.data.map(x => {
            return {
              id: x.id,
              answer: x.answer
            };
          }) : []
        };
      }) : [],
    };

    return model;
  }
  searchRequest(search: CertificateSearchVM): SearchRequestVM {
    const searchRequest: SearchRequestVM = {};
    searchRequest.include = [];
    searchRequest.page = search.pageIndex;
    searchRequest.order_by = search.sortBy ? search.sortBy : 'is_recommended';
    searchRequest.order_dir = search.sortDir ? search.sortDir : 'desc';
    searchRequest.limit = search.pageSize;
    searchRequest.only_fields = [];
    searchRequest.filters = [];
    if (search.search) {
      searchRequest.filters.push({ key: 'search', value: search.search });
    }
    if (search.type === 'exclusive') {
      searchRequest.filters.push({ key: 'only_exclusive', value: true });
    }
    if (search.type === 'exclusive' || search.type === 'all') {
      searchRequest.filters.push({ key: 'without_passed', value: true });
    }
    if (search.type === 'all') {
      searchRequest.filters.push({ key: 'without_exclusive', value: true });
    }
    if (search.category) {
      searchRequest.filters.push({ key: 'category', value: search.category });
    }
    if (search.legal) {
      searchRequest.filters.push({ key: 'with_legal', value: true });
    }
    if (search.attributes) {
      search.attributes.forEach(a => {
        searchRequest.filters?.push({ key: a, value: true });
      });
    }
    if (search.recommendation) {
      search.recommendation.forEach(a => {
        searchRequest.filters?.push({ key: a, value: true });
      });
    }
    return searchRequest;
  }
}
