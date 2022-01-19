import { ApprovalRequestSearchVM, ApprovalRequestVM } from './../../model/approval-request.model';
import { BudgetResponse, RecordResponse } from './../../model/budget.response';
import { BudgetVM, RecordVM } from '../../model/budget.model';

import { ApprovalRequestResponse } from './../../model/approval-request.response';
import { AssignmentMappingService } from './assignment-mapping.service';
import { Injectable } from "@angular/core";
import { MultipleResponse } from '../../model/response';
import { PagedResult } from '../../model/pagination.model';
import { SearchRequestVM } from '../../model/search.model';
import { SiteVM } from "../../model/site.model";

@Injectable()
export class ApprovalRequestMappingService {
  constructor() {

  }

  approvalRequestMultipleResponseToVM(response: MultipleResponse<ApprovalRequestResponse>): PagedResult<ApprovalRequestVM> {
    const obj: PagedResult<ApprovalRequestVM> = {
      pageInfo: { ...response.meta?.pagination },
      list: []
    };
    if (response.data?.length) {
      response.data.forEach(item => {
        const budget: ApprovalRequestVM = this.approvalRequestResponseToVM(item);
        obj.list.push(budget);
      });
    }
    return obj;
  }
  approvalRequestResponseToVM(response: ApprovalRequestResponse): ApprovalRequestVM {
    const approvalRequestVM: ApprovalRequestVM = {};
    approvalRequestVM.action = response.action;
    approvalRequestVM.created_at = response.created_at;
    approvalRequestVM.deleted_at = response.deleted_at;
    approvalRequestVM.id = response.id;
    approvalRequestVM.params = response.params;
    approvalRequestVM.data = response.data;
    approvalRequestVM.type = response.type;
    approvalRequestVM.updated_at = response.updated_at;
    approvalRequestVM.freelancer_id = response.params?.freelancer_id;
    if (response.user) {
      approvalRequestVM.user = response.user ? response.user.data : undefined;
      approvalRequestVM.profile = approvalRequestVM.user && approvalRequestVM.user.freelancer ? approvalRequestVM.user.freelancer.data : undefined;
      approvalRequestVM.fullname = approvalRequestVM.profile ? approvalRequestVM.profile.fullname : undefined;
      approvalRequestVM.zip = approvalRequestVM.profile ? approvalRequestVM.profile.zip : undefined;
      if (approvalRequestVM.profile && approvalRequestVM.profile.approvals) {
        approvalRequestVM.profile.approvals = this.transformApprovals(approvalRequestVM.profile.approvals.data);
      }
      approvalRequestVM.avatarId = approvalRequestVM.profile?.face_picture_id
    } else {
      approvalRequestVM.fullname = '-';
      approvalRequestVM.zip = '-';
      approvalRequestVM.user = {
        email: '-'
      };
    }
    return approvalRequestVM;
  }
  transformApprovals(approvals: any) {
    let approvalsObj: any = {};
    if (approvals) {
      approvals.forEach((approval: any) => {
        approvalsObj[approval.type] = approval;
      });
    }
    return approvalsObj;
  }
  searchRequest(search: ApprovalRequestSearchVM): SearchRequestVM {
    const searchRequest: SearchRequestVM = {};
    searchRequest.include = ['user'];
    searchRequest.page = search.pageIndex;
    searchRequest.order_by = search.sortBy;
    searchRequest.order_dir = search.sortDir;
    searchRequest.limit = search.pageSize;
    searchRequest.filters = [];
    if (search.type) {
      searchRequest.filters.push({
        key: 'type',
        value: search.type,
      });
    }
    if (search.contractType) {
      searchRequest.filters.push({
        key: 'contract_type_id',
        value: search.contractType,
      });
    }
    if (search.postcodesMin) {
      searchRequest.filters.push({
        key: 'zip_from',
        value: search.postcodesMin,
      });
    }
    if (search.postcodesMax) {
      searchRequest.filters.push({
        key: 'zip_to',
        value: search.postcodesMax,
      });
    }
    if (search?.search) {
      searchRequest.filters.push({ key: 'search', value: search?.search });
    }
    if (search.action) {
      searchRequest.filters.push({ key: 'action', value: search.action });
    }
    return searchRequest;
  }

}
