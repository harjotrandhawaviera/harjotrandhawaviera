import * as moment from 'moment';

import {
  FreelancerDocumentResponse,
  FreelancerResponse,
  GTCSDocResponse,
  GTCSResponse,
  IdentitydocumentsResponse,
  PictureResponse,
  ReferncesResponse,
  TrainingsResponse,
  WorkHistoryResponse
} from '../../model/freelancer.response';
import { FreelancerDocumentsVM, GTCSDocVM, GTCSVM, IdentitydocumentsVM, QualificationsVM, WorkHistoryVM } from './../../model/freelancer.model';
import {
  FreelancerSearchVM,
  FreelancerVM,
  ReferncesVM
} from '../../model/freelancer.model';
import { IdRequestVM, SearchRequestVM } from '../../model/search.model';
import { TrainingDetailsVM, TrainingVM } from '../../model/exam.model';

import { CertificateMappingService } from './certificate-mapping.service';
import { DatePipe } from '@angular/common';
import { FormConfig } from '../../constant/forms.constant';
import { FormatService } from '../format.service';
import { Injectable } from '@angular/core';
import { MultipleResponse } from '../../model/response';
import { PagedResult } from '../../model/pagination.model';
import { QualificationsResponse } from './../../model/freelancer.response';
import { UserConfig } from '../../constant/user.constant';
import { environment } from './../../../environments/environment';

@Injectable()
export class FreelancerMappingService {
              constructor(private certificateMappingService: CertificateMappingService, private datePipe: DatePipe, private formatService: FormatService) { }
  freelancerSearchResponseToVM(
    response: MultipleResponse<FreelancerResponse>
  ): PagedResult<FreelancerVM> {
    const obj: PagedResult<FreelancerVM> = {
      pageInfo: { ...response.meta?.pagination },
      list: [],
    };
    if (response.data?.length) {
      response.data.forEach((item) => {
        const freelancer: FreelancerVM = this.freelancerResponseToVM(item);
        obj.list.push(freelancer);
      });
    }
    return obj;
  }
  freelancerVMToMasterResponse(model: FreelancerVM): FreelancerResponse {
    const response: FreelancerResponse = {};
    response.title = model.title;
    response.firstname = model.firstname;
    response.lastname = model.lastname;
    response.birthdate = model.birthdate ? this.formatService.date(model.birthdate, true, 'YYYY-MM-DD') : null;
    response.gender = model.gender;
    response.birthplace = model.birthplace;
    response.birthcountry = model.birthcountry;
    response.has_driverslicense = model.has_driverslicense ? true : false;
    response.mobile = model.mobile;
    response.alternative_phone = model.alternative_phone;
    response.mobile_contry_code = model.mobile_contry_code;
    response.mobile_contry_code2 = model.mobile_contry_code2;
    response.mobile_dial_code = model.mobile_dial_code;
    response.mobile_dial_code2 = model.mobile_dial_code2;
    response.address = model.address;
    response.addressaddition = model.addressaddition;
    response.locality = model.locality;
    response.locality_lat = model.locality_lat;
    response.locality_lng = model.locality_lng;
    response.zip = model.zip;
    response.city = model.city;
    response.country = model.country;
    response.near_to_city = model.near_to_city;
    response.address2 = model.address2;
    response.addressaddition2 = model.addressaddition2;
    response.locality_alternative = model.locality_alternative;
    response.zip2 = model.zip2;
    response.city2 = model.city2;
    response.country2 = model.country2;
    response.near_to_city2 = model.near_to_city2;
    response.driver_license = model.driver_license;
    return response;
  }
  freelancerVMToAppearanceResponse(model: FreelancerVM): FreelancerResponse {
    const response: FreelancerResponse = {};
    response.height = model.height || null;
    response.chest = model.chest || null;
    response.waist = model.waist || null;
    response.hip = model.hip || null;
    response.shirtsize = model.shirtsize || null;
    response.pants = model.pants || null;
    response.shoesize = model.shoesize || null;
    response.haircolor = model.haircolor || null;
    response.body_picture_id = model.body_picture_id || undefined;
    response.face_picture_id = model.face_picture_id || undefined;
    return response;
  }
  freelancerVMToLegalResponse(model: FreelancerVM): FreelancerResponse {
    const response: FreelancerResponse = {
      bankaccount_holder: model.bankaccount_holder || model.fullname || null,
      iban: model.iban || null,
      bic: model.bic || null,
      bankname: model.bankname || null,
      bankDetailsDocument: model.bankDetailsDocument,
      // idcard_number: model.idcard_number || null,
      // idcard_invalid_at: (model.idcard_invalid_at ? this.formatService.date(model.idcard_invalid_at, true, 'YYYY-MM-DD') : null),
      identityDocuments:  model.identityDocuments,
      nationality: model.nationality || null,
      tax_number: model.tax_number || null,
      vat_tax_id: model.vat_tax_id || null,
      socialsecurity_number: model.socialsecurity_number || null,
      health_insurance_type: model.health_insurance_type || null,
      child_tax_allowance: model.child_tax_allowance || null,
      tax_class: model.tax_class || null,
      tax_id: model.tax_id || null,
      profession: model.profession || null,
      health_insurance_id: model.health_insurance_id || null,
      contract_type_ids: model.contract_type_ids
    };
    return response;
  }
  freelancerResponseToVM(response: FreelancerResponse, docResponse?: any): FreelancerVM {
    const freelancerVM: FreelancerVM = {};
    freelancerVM.address = response.address;
    freelancerVM.address2 = response.address2;
    freelancerVM.addressaddition = response.addressaddition;
    freelancerVM.addressaddition2 = response.addressaddition2;
    freelancerVM.locality = response.locality;
    freelancerVM.locality_lat = response.locality_lat;
    freelancerVM.locality_lng = response.locality_lng;
    freelancerVM.locality_alternative = response.locality_alternative;
    freelancerVM.age = response.age;
    freelancerVM.aggregated_assignment_rating =
      response.aggregated_assignment_rating;
    freelancerVM.aggregated_freelancer_rating =
      response.aggregated_freelancer_rating;
    freelancerVM.alternative_phone = response.alternative_phone;
    freelancerVM.mobile_contry_code = response.mobile_contry_code;
    freelancerVM.mobile_contry_code2 = response.mobile_contry_code2;
    freelancerVM.mobile_dial_code = response.mobile_dial_code;
    freelancerVM.mobile_dial_code2 = response.mobile_dial_code2;
    if (response.approvals && response.approvals.data) {
      freelancerVM.approvals = response.approvals.data;
    }
    freelancerVM.approved_at = response.approved_at;
    freelancerVM.approved_by = response.approved_by;
    freelancerVM.avg_assignment_rating = response.avg_assignment_rating;
    freelancerVM.avg_rating = response.avg_rating;
    freelancerVM.bankaccount_holder = response.bankaccount_holder;
    freelancerVM.bankname = response.bankname;
    freelancerVM.bic = response.bic;
    freelancerVM.birthcountry = response.birthcountry;
    freelancerVM.birthdate = response.birthdate;
    freelancerVM.birthplace = response.birthplace;
    freelancerVM.body = response.body;
    freelancerVM.body_picture_id = response.body_picture_id;
    if (response.certificates && response.certificates.data) {
      freelancerVM.certificates = response.certificates.data.map((a) =>
        this.certificateMappingService.certificateResponseToVM(a)
      );
    }

    freelancerVM.chest = response.chest;
    freelancerVM.child_tax_allowance = response.child_tax_allowance;
    freelancerVM.city = response.city;
    freelancerVM.city2 = response.city2;
    console.log(response.contract_type_ids, 'response.contract_type_ids');
    freelancerVM.contract_type_ids = response.contract_type_ids;
    if (response.contract_types && response.contract_types.data) {
      freelancerVM.contract_types = response.contract_types.data;
    }

    freelancerVM.count_checkins_last_year = response.count_checkins_last_year;
    freelancerVM.count_checkins_total = response.count_checkins_total;
    freelancerVM.country = response.country;
    freelancerVM.country2 = response.country2;
    freelancerVM.created_at = response.created_at;
    freelancerVM.created_by = response.created_by;
    freelancerVM.deleted_at = response.deleted_at;
    freelancerVM.deleted_by = response.deleted_by;
    freelancerVM.denomination = response.denomination;
    freelancerVM.documents = response.documents && response.documents.data ?
      response.documents.data.map(a => this.transformFreelancerDocument(a)) : [];
    freelancerVM.requests = response.requests && response.requests.data ? response.requests.data.map(a => {
      return {
        action: a.action,
        id: a.id,
        params: a.params,
        type: a.type
      }
    }) : [];
    freelancerVM.face_picture_id = response.face_picture_id;
    freelancerVM.firstname = response.firstname;
    freelancerVM.fullname = response.fullname;
    freelancerVM.gender = response.gender;
    freelancerVM.about_me = response.about_me;
    freelancerVM.resume = response.resume;
    // freelancerVM.trainingAndCertificates = response.trainingAndCertificates?.data;
    // freelancerVM.gtcs = response.gtcs ? response.gtcs.data : [];

    freelancerVM.haircolor = response.haircolor;
    freelancerVM.pants = response.pants;
    freelancerVM.shoesize = response.shoesize;
    freelancerVM.has_current_gtc_accepted = response.has_current_gtc_accepted;
    freelancerVM.has_driverslicense = response.has_driverslicense;
    freelancerVM.health_insurance_type = response.health_insurance_type;
    freelancerVM.health_insurance_id = response.health_insurance_id;
    freelancerVM.health_insurance_number = response.health_insurance_number;
    freelancerVM.height = response.height;
    freelancerVM.hip = response.hip;
    freelancerVM.iban = response.iban;
    freelancerVM.id = response.id;
    freelancerVM.expiry_date = response.expiry_date;
    freelancerVM.id_number = response.id_number;
    freelancerVM.is_approved = response.is_approved;
    freelancerVM.is_vat_tax_liable = response.is_vat_tax_liable;
    freelancerVM.languages = response.languages;
    freelancerVM.lastname = response.lastname;
    freelancerVM.legal_documents_blocking = response.legal_documents_blocking;
    freelancerVM.legal_documents_reminder = response.legal_documents_reminder;
    freelancerVM.mobile = response.mobile;
    freelancerVM.nationality = response.nationality;
    freelancerVM.nationality_name = response.nationality_name;
    freelancerVM.near_to_city = response.near_to_city;
    freelancerVM.near_to_city2 = response.near_to_city2;
    freelancerVM.work_preference = response.work_preference;
    freelancerVM.industry_exposure = response.industry_exposure;
    freelancerVM.workHistories = response.workHistories ? response.workHistories.data : [];
    freelancerVM.skills = response.skills;
    freelancerVM.primary_role = response.primary_role;
    freelancerVM.skill_documents = response.skill_documents;
    freelancerVM.secondry_role =response.secondry_role ? response.secondry_role : '';
     freelancerVM.pictures =
      response.pictures && response.pictures.data ? response.pictures.data : [];
    freelancerVM.profession = response.profession;
    freelancerVM.qualifications =
      response.qualifications && response.qualifications.data
        ? response.qualifications.data.map((a) => this.qualificationResToVM(a))
        : [];
    freelancerVM.trainingAndCertificates =
      response.trainingAndCertificates && response.trainingAndCertificates.data
        ? response.trainingAndCertificates.data.map((a) => this.trainingVMToRe(a))
        : [];
    freelancerVM.references =
      response.references && response.references.data
        ? response.references.data.map((a) => this.referenceResToVM(a))
        : [];
    freelancerVM.identityDocuments =
      response.identityDocuments && response.identityDocuments.data
        ? response.identityDocuments.data.map((a: any) => this.identityDocumentsResToVM(a))
        : [];
    freelancerVM.ratings = response.ratings && response.ratings.data ? response.ratings.data.map(a => {
      return {
        comment: a.comment,
        created_at: a.created_at,
        creator: a.creator ? a.creator.data : undefined,
        freelancer_id: a.freelancer_id,
        id: a.id,
        rate: a.rate,
        updated_at: a.updated_at,
        user_id: a.user_id
      }
    }) : [];
    // freelancerVM.references = response.references;
    // freelancerVM.requests = response.requests;
    freelancerVM.shirtsize = response.shirtsize;
    freelancerVM.socialsecurity_number = response.socialsecurity_number;
    freelancerVM.tax_class = response.tax_class;
    freelancerVM.tax_id = response.tax_id;
    freelancerVM.tax_number = response.tax_number;
    freelancerVM.title = response.title;
    freelancerVM.type = response.type;
    freelancerVM.resume = response.resume_detail;
    freelancerVM.updated_at = response.updated_at;
    freelancerVM.updated_by = response.updated_by;
    freelancerVM.about_me = response.about_me;
    if (response.user && response.user.data) {
      const user = response.user.data;
      freelancerVM.user = {
        id: user.id,
        status: user.status,
        created_at: user.created_at,
        email: user.email,
        active_at: user.active_at,
        confirmed_at: user.confirmed_at,
        contract_type_pending: user.contract_type_pending,
        deactivated_at: user.deactivated_at,
        deactivated_by: user.deactivated_by,
        deactivated_reason: user.deactivated_reason,
        disabled_at: user.disabled_at,
        disabled_reason: user.disabled_reason,
        fullname: user.fullname,
        gtc_blocked: user.gtc_blocked,
        has_requested_password_reset: user.has_requested_password_reset,
        is_confirmed: user.is_confirmed,
        is_deactivated: user.is_deactivated,
        is_disabled: user.is_disabled,
        legal_blocked: user.legal_blocked,
        legal_reminder: user.legal_reminder,
        role: user.role,
      };
    }
    freelancerVM.vat_tax_id = response.vat_tax_id;
    freelancerVM.contract_type_ids = response.contract_type_ids;
    freelancerVM.waist = response.waist;
    freelancerVM.zip = response.zip;
    freelancerVM.zip2 = response.zip2;
    freelancerVM.primary_role = response.primary_role;
    freelancerVM.skill_documents = response.skill_documents;
    freelancerVM.secondry_role = response.secondry_role ? response.secondry_role : '';
    if (response.gtcs && response.gtcs.data) {
      freelancerVM.gtcs = response.gtcs.data.map(a => {
        return this.gtcsDocTransform(a)
      });
    }
    if (docResponse && docResponse.data) {
      freelancerVM.gtcsDoc = docResponse.data.map((a: any) => {
        return this.freelancerGTCSDocMapping(a)
      });
      freelancerVM.gtcsDoc1 = {}
      var result = {};
      (freelancerVM.gtcsDoc || []).forEach((item) => {
        if (item.gtc_document_id && freelancerVM.gtcsDoc1) {
          freelancerVM.gtcsDoc1[item.gtc_document_id] = item;
        }
      });
    }
    if (response.user && response.user.data) {
      const active_at = response.user.data.active_at;
      const minTime = UserConfig.activeTime.value;
      const minTimeUnit = UserConfig.activeTime.unit;
      const date = moment().subtract(5, 'minutes');
      freelancerVM.online = !!(active_at && moment(active_at).isAfter(date));
    }

    const orgPictures: any = {
      current: {
        additional: [],
      },
      pending: {},
      original: {}, // Original pictures are needed for approved freelancer only
    };
    // Change requests can exist only for approved freelancers (onboarding completed)
    const changeRequests =
      (response.requests &&
        response.requests.data &&
        response.requests.data?.filter(
          (a) => a.type === 'freelancer-changerequest'
        )) ||
      [];

    // Prepare an object containing pending picture ids mapped to the related action to use while grouping pictures
    var pendingPicturesMap: any = {};
    changeRequests.forEach((request) => {
      if (request.params && request.params.picture_id) {
        pendingPicturesMap[request.params.picture_id] = request.action;
      }
    });
    if (response.pictures && response.pictures.data) {
      response.pictures.data.forEach((pict) => {
        if (response.body_picture_id === pict.id) {
          orgPictures.current.body = this.transformPicture(pict, true);
          if (response.is_approved) {
            orgPictures.original.body = this.transformPicture(pict, true);
          }
        } else if (response.face_picture_id === pict.id) {
          orgPictures.current.profile = this.transformPicture(pict, true);
          if (response.is_approved) {
            orgPictures.original.profile = this.transformPicture(pict, true);
          }
        } else if (pict.id && pendingPicturesMap[pict.id]) {
          if (
            pendingPicturesMap[pict.id] === 'replace-freelancer-bodypicture'
          ) {
            orgPictures.pending.body = this.transformPicture(pict, true);
          } else if (
            pendingPicturesMap[pict.id] === 'replace-freelancer-portraitpicture'
          ) {
            orgPictures.pending.profile = this.transformPicture(pict, true);
          }
        } else {
          orgPictures.current.additional.push(
            this.transformPicture(pict, true)
          );
        }
      });
    }
    freelancerVM.orgPictures = orgPictures;

    freelancerVM.documents = this.getFreelancerDocuments(response);
    freelancerVM.addresses = this.transformAddress(response);
    freelancerVM.duplicates = response.duplicates;
    freelancerVM.driver_license = response.driver_license || [];
    return freelancerVM;
  }
  transformAddress(data: any): any[] | undefined {
    const fields = ['address', 'addressaddition', 'zip', 'city', 'country', 'near_to_city'];
    const addresses = [];
    for (let index = 0; index < 2; index++) {
      const element = {};
    }
    if (fields.findIndex(a => data[a]) !== -1) {
      const address: any = {};
      fields.forEach(a => {
        address[a] = data[a];
      });
      addresses.push(address);
    }
    if (fields.findIndex(a => data[a + '2']) !== -1) {
      const address: any = {};
      fields.forEach(a => {
        address[a] = data[a + '2'];
      });
      addresses.push(address);
    }
    return addresses;
  }
  private gtcsDocTransform1(a: GTCSResponse): GTCSVM {
    return {
      accepted_at: a.accepted_at,
      comment: a.comment,
      contract_type_id: a.contract_type_id,
      document_id: a.document_id,
      documents: a.documents?.data?.map(x => {
        const gtcsDoc: GTCSDocVM = {};
        gtcsDoc.freelancer_id = x.freelancer_id;
        gtcsDoc.gtc_document_id = x.gtc_document_id;
        gtcsDoc.freelancer_document_id = x.freelancer_document_id;
        gtcsDoc.is_checked = x.is_checked;
        gtcsDoc.invalid_at = x.invalid_at;
        gtcsDoc.is_approved = x.is_approved;
        gtcsDoc.approved_by = x.approved_by;
        gtcsDoc.id = x.id;
        gtcsDoc.gtc_id = x.gtc_id;
        gtcsDoc.identifier = x.identifier;
        gtcsDoc.published_at = x.published_at;
        gtcsDoc.valid_at = x.valid_at;
        gtcsDoc.comment = x.comment;
        gtcsDoc.data = x.data;
        gtcsDoc.contract_type_id = x.contract_type_id;
        gtcsDoc.confirmation_type = x.confirmation_type;
        gtcsDoc.type = x.type;
        gtcsDoc.reconfirmation_type = x.reconfirmation_type;
        gtcsDoc.reconfirmation_index = x.reconfirmation_index;
        gtcsDoc.reconfirmation_interval = x.reconfirmation_interval;
        gtcsDoc.url = x.url;
        gtcsDoc.contract_type_identifier = x.contract_type_identifier;
        gtcsDoc.document = x.document ? this.transformDocument(x.document.data, true) : undefined;
        return gtcsDoc;
      }),
      freelancer_id: a.freelancer_id,
      id: a.id,
      identifier: a.identifier,
      invalid_at: a.invalid_at,
      is_current: a.is_current,
      published_at: a.published_at,
      valid_at: a.valid_at,
    };
  }
  private gtcsDocTransform(a: GTCSResponse): GTCSVM {
    return {
      accepted_at: a.accepted_at,
      comment: a.comment,
      contract_type_id: a.contract_type_id,
      document_id: a.document_id,
      documents: a.documents?.data?.map(x => {
        return this.freelancerGTCSDocMapping(x);
      }),
      freelancer_id: a.freelancer_id,
      id: a.id,
      identifier: a.identifier,
      invalid_at: a.invalid_at,
      is_current: a.is_current,
      published_at: a.published_at,
      valid_at: a.valid_at,
    };
  }

  private freelancerGTCSDocMapping(x: GTCSDocResponse) {
    const gtcsDoc: GTCSDocVM = {};
    gtcsDoc.freelancer_id = x.freelancer_id;
    gtcsDoc.gtc_document_id = x.gtc_document_id;
    gtcsDoc.freelancer_document_id = x.freelancer_document_id;
    gtcsDoc.is_checked = x.is_checked;
    gtcsDoc.invalid_at = x.invalid_at;
    gtcsDoc.is_approved = x.is_approved;
    gtcsDoc.approved_by = x.approved_by;
    gtcsDoc.id = x.id;
    gtcsDoc.gtc_id = x.gtc_id;
    gtcsDoc.identifier = x.identifier;
    gtcsDoc.published_at = x.published_at;
    gtcsDoc.valid_at = x.valid_at;
    gtcsDoc.comment = x.comment;
    gtcsDoc.data = x.data;
    gtcsDoc.contract_type_id = x.contract_type_id;
    gtcsDoc.confirmation_type = x.confirmation_type;
    gtcsDoc.type = x.type;
    gtcsDoc.name = x.name;
    gtcsDoc.reconfirmation_type = x.reconfirmation_type;
    gtcsDoc.reconfirmation_index = x.reconfirmation_index;
    gtcsDoc.reconfirmation_interval = x.reconfirmation_interval;
    gtcsDoc.url = x.url;
    gtcsDoc.contract_type_identifier = x.contract_type_identifier;
    gtcsDoc.document = x.document ? this.transformDocument(x.document.data, true) : undefined;
    gtcsDoc.freelancer_documents = x.freelancer_documents && x.freelancer_documents.data && x.freelancer_documents.data.length > 0 ? x.freelancer_documents?.data?.map(free => {
      return {
        document: free.document ? this.transformDocument(free.document.data, true) : undefined,
        id: free.id,
        type: free.type,
        url: free.url
      };
    }) : new Array(1);
    return gtcsDoc;
  }

  private getFreelancerDocuments(response: FreelancerResponse) {
    const isFreelancerApproved = response.is_approved;
    const freelancerDocuments: any = {
      current: {},
      // Original and pending documents are used by approved freelancer only
      original: {},
      pendingId: {}
    };
    const requestDocTypes: string[] = [];
    const typeActionMapping: any = FormConfig.legal.type_action_mapping;
    for (const key in typeActionMapping) {
      if (Object.prototype.hasOwnProperty.call(typeActionMapping, key)) {
        requestDocTypes.push(key)
      }
    }
    if (response.documents && response.documents.data?.length) {
      response.documents.data.forEach(doc => {
        if (doc.type && !this.isFreelancerGtcDoc(doc.type)) {
          freelancerDocuments.current[doc.type] = doc.document ? this.transformDocument(doc.document.data, true) : {};
          if (isFreelancerApproved && requestDocTypes.includes(doc.type) && doc.document) {
            // Save the document (in original) which can be replaced after approval only
            freelancerDocuments.original[doc.type] = this.transformDocument(doc.document.data, true);
          }
        }
      })

    }
    // requests might be already transformed, f.e. after calling transformMasterData
    const changeRequests =
      (response.requests &&
        response.requests.data &&
        response.requests.data?.filter(
          (a) => a.type === 'freelancer-changerequest'
        )) ||
      [];
    changeRequests.forEach((request) => {
      if (request.action) {
        var docType = typeActionMapping[request.action];
        if (request.params && docType && !this.isFreelancerGtcDoc(docType)) {
          if (request.params && request.params.document_id) {
            freelancerDocuments.pendingId[docType] = request.params.document_id;
          }
        }
      }
    });
    return freelancerDocuments;
  }
  isFreelancerGtcDoc(docType: string) {
    return docType === 'signed-terms-and-conditions' || docType === 'signed-attachment';
  }
  transformFreelancerDocument(doc: FreelancerDocumentResponse) {
    const obj: FreelancerDocumentsVM = {
      id: doc.id,
      type: doc.type,
      url: doc.url,
      document: doc.document ? this.transformDocument(doc.document.data, true) : undefined
    };
    return obj
  }
  transformDocument(doc: any, saved: boolean) {
    if (doc.documents && doc.documents.data) {
      doc.documents = doc.documents.data.map((document: any) => {
        return this.transformSingleDoc(document, saved);
      });
    }
    return this.transformSingleDoc(doc, saved);
  }

  transformSingleDoc(doc: any, saved: boolean) {
    return {
      ...doc,
      url: doc.url || environment.api + `/documents/${doc.id}`,
      mime: doc.mime || null,
      size: doc.size || null,
      originalFilename: doc.original_filename || null,
      saved: saved
    };
  }
  transformPicture(pic: PictureResponse, saved: boolean) {
    return {
      ...pic,
      url: {
        full: environment.api + `/pictures/${pic.id}` + '/full',
        medium: environment.api + `/pictures/${pic.id}` + '/medium',
        thumbnail: environment.api + `/pictures/${pic.id}` + '/icon',
      },
      saved: saved,
    };
  }
  referenceVMToRe(model: ReferncesVM): ReferncesResponse {
    const response: ReferncesResponse = {
      name: model.name,
      // document_id: model.document ? model.document.id : undefined,
      freelancer_id: model.freelancer_id,
      relationship: model.relationship,
      document: model.document,
      id: model.id,
      email: model.email,
      isVerification: model.isVerification,
      contact_number: model.contact_number,
      document_id: model.document_id
    };
    return response;
  }
  qualificationVMToRe(model: QualificationsVM): QualificationsResponse {
    const response: QualificationsResponse = {
      school_college_university: model.school_college_university,
      document_id: model.document ? model.document.id : undefined,
      freelancer_id: model.freelancer_id,
      description: model.description,
      grade: model.grade,
      document: model.document,
      fieldofstudy: model.fieldofstudy,
      degree: model.degree,
      id: model.id,
      start_date: model.start_date ? this.formatService.date(model.start_date, true, 'YYYY-MM-DD') : undefined,
      end_date: model.end_date ? this.formatService.date(model.end_date, true, 'YYYY-MM-DD') : undefined,
    };
    return response;
  }

  identityDocumentsVMToRe(model: IdentitydocumentsVM): IdentitydocumentsResponse {
    const response: IdentitydocumentsResponse = {
      id_name: model.id_name,
      document_id: model.document ? model.document.id : undefined,
      expiry_date: model.expiry_date,
      freelancer_id: model.freelancer_id,
      id_number: model.id_number,
      document: model.document,
      id: model.id,
    };
    return response;
  }
  trainingVMToRe(model: TrainingDetailsVM): TrainingsResponse {
    const response: TrainingsResponse = {
      name: model.name,
      // document_id: model.document ? model.document.id : undefined,
      freelancer_id: model.freelancer_id,
      description: model.description,
      issuing_organization: model.issuing_organization,
      document_id: model.document_id,
      id: model.id,
      document: model.document?.data,
      issue_date:this.datePipe.transform(model.issue_date, 'yyyy-MM-dd')
     };
    return response;
  }
  workHistoryVMToRe(model: WorkHistoryVM): WorkHistoryResponse {
    const response: WorkHistoryResponse = {
      job_title: model.job_title,
      id: model.id,
      // document_id: model.document ? model.document.id : undefined,
      freelancer_id: model.freelancer_id,
      description: model.description,
      company_name: model.company_name,
      document_id: model.document_id,
      document: model.document,
      is_current_company: model.is_current_company == "no" ? false : true,
      start_from:this.datePipe.transform(model.start_from, 'yyyy-MM-dd'),
      till: model.till == "Present" ?  null : this.datePipe.transform(model.till, 'yyyy-MM-dd')
     };
    return response;
  }
  identityDocumentsResToVM(model: IdentitydocumentsVM): IdentitydocumentsResponse {
    const response: IdentitydocumentsResponse = {
      id_name: model.id_name,
      // document_id: model.document ? model.document.id : undefined,
      id_number: model.id_number,
      expiry_date: this.datePipe.transform(model.expiry_date, 'yyyy-MM-dd'),
      document_id: model.document_id,
      document: model.document,
      id: model.id
      };
    return response;
  }


  referenceResToVM(response: ReferncesResponse): ReferncesVM {
    const vm: ReferncesVM = {
      name: response.name,
      relationship: response.relationship,
      email: response.email,
      contact_number: response.contact_number,
      document_id: response.document_id,
      id: response.id,
      isVerification: response.isVerification,
      document: response.document,
    };
    if (response.document && response.document.data) {
      const doc = response.document?.data ? response.document.data : response.document;
      vm.document = {};
      vm.document.id = doc.id;
      vm.document.mime = doc.mime;
      vm.document.original_filename = doc.original_filename;
      vm.document.size = doc.size;
      vm.document.url = doc.url;
    }
    return vm;
  }
  qualificationResToVM(response: QualificationsResponse): QualificationsVM {
    const vm: QualificationsVM = {
      end_date: response.end_date,
      document_id: response.document_id,
      freelancer_id: response.freelancer_id,
      description: response.description,
      id: response.id,
      school_college_university: response.school_college_university,
      degree: response.degree,
      fieldofstudy: response.fieldofstudy,
      grade: response.grade,
      start_date: response.start_date,
      document: response.document
    };
    if (response.document && response.document) {
      const doc = response.document?.data ? response.document.data : response.document;
      vm.document = {};
      vm.document.id = doc.id;
      vm.document.mime = doc.mime;
      vm.document.original_filename = doc.original_filename;
      vm.document.size = doc.size;
      vm.document.url = doc.url;
    }
    return vm;
  }
  searchRequest(search: FreelancerSearchVM): SearchRequestVM {
    const searchRequest: SearchRequestVM = {};
    searchRequest.include = ['user'];
    searchRequest.page = search.pageIndex;
    searchRequest.order_by = search.sortBy;
    searchRequest.order_dir = search.sortDir;
    searchRequest.limit = search.pageSize;
    searchRequest.only_fields = [
      'freelancer.id',
      'freelancer.firstname',
      'freelancer.lastname',
      'freelancer.fullname',
      'freelancer.zip',
      'freelancer.city',
      'freelancer.mobile',
      'freelancer.avg_assignment_rating',
      'freelancer.face_picture_id',
      'user.id',
      'user.email',
      'user.has_requested_account_delete',
      'user.has_requested_password_reset',
      'user.status',
      'user.active_at',
      'user.created_at',
      'user.confirmed_at',
    ];
    searchRequest.filters = [];
    if (search.postcodesMin) {
      searchRequest.filters.push({
        key: 'zip_from',
        value: search.postcodesMin,
      });
    }
    if (search.postcodesMax) {
      searchRequest.filters.push({ key: 'zip_to', value: search.postcodesMax });
    }
    if (search.status && search.status.length) {
      searchRequest.filters.push({
        key: 'status',
        value: search.status.join(','),
      });
    }
    if (search.certificates) {
      searchRequest.filters.push({
        key: 'certificates',
        value: search.certificates.join(','),
      });
    }
    if (search.assignment_rating) {
      searchRequest.filters.push({
        key: 'assignment_rating',
        value: search.assignment_rating,
      });
    }
    if (search.freelancer_rating) {
      searchRequest.filters.push({
        key: 'freelancer_rating',
        value: search.freelancer_rating,
      });
    }
    if (search.contractType) {
      searchRequest.filters.push({
        key: 'contract_type_id',
        value: search.contractType,
      });
    }
    if (search.search) {
      searchRequest.filters.push({ key: 'search', value: search.search });
    }
    return searchRequest;
  }
  getByIdRequest(id: string) {
    const searchRequest: IdRequestVM = {};
    searchRequest.id = id;
    searchRequest.filters = [{ key: 'add_summary', value: true }];
    searchRequest.include = [
      'documents',
      'client.contacts',
      'client.sites.client_site_contact',
      'certificates',
      'agent',
      'budget.contacts',
      'order',
      'contact',
    ];
    return searchRequest;
  }
  prepareFreelancerGtcDocuments(gtcDocs: any): any[] {
    var preparedDocuments: any[] = [];
    for (const key in gtcDocs) {
      if (Object.prototype.hasOwnProperty.call(gtcDocs, key)) {
        const doc = gtcDocs[key];
        preparedDocuments.push({
          is_checked: doc.is_checked,
          gtc_document_id: key,
          document_id: doc.freelancer_documents && doc.freelancer_documents[0] ? doc.freelancer_documents[0].id : undefined
        });
      }
    }
    return preparedDocuments;
  }
}
