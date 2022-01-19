import * as moment from 'moment';

import { IdRequestVM, SearchRequestVM } from './../../model/search.model';
import { RightsResponse, UserResponse } from '../../model/user.response';
import { RightsVM, UserSearchVM, UserVM } from '../models/user.model';

import { AgentResponse } from '../../model/agent.response';
import { AgentVM } from '../../model/agent.model';
import { Injectable } from '@angular/core';
import { MultipleResponse } from './../../model/response';
import { PagedResult } from './../../model/pagination.model';
import { RoleResponse } from '../../model/role.response';
import { RoleVM } from '../../model/role.model';
import { TranslateService } from './../../services/translate.service';
import { UserConfig } from '../../constant/user.constant';

@Injectable()
export class UserMappingService {
  constructor(private translateService: TranslateService) {}
  searchResponseToVM(
    response: MultipleResponse<UserResponse>
  ): PagedResult<UserVM> {
    const obj: PagedResult<UserVM> = {
      pageInfo: { ...response.meta?.pagination },
      list: [],
    };
    if (response.data?.length) {
      response.data.forEach((item) => {
        const user: UserVM = this.userResponseToVM(item);
        obj.list.push(user);
      });
    }

    return obj;
  }

  userResponseToVM(response: UserResponse): UserVM {
    const user: UserVM = {};

    user.id = response.id;
    user.active_at = response.active_at;
    user.confirmed_at = response.confirmed_at;
    user.contract_type_pending = response.contract_type_pending;
    user.created_at = response.created_at;
    user.created_by = response.creator?.data?.name;
    user.deactivated_at = response.deactivated_at;
    user.deactivated_by = response.deactivated_by;
    user.deactivated_reason = response.deactivated_reason;
    user.disabled_at = response.disabled_at;
    user.disabled_by = response.disabled_by;
    user.disabled_reason = response.disabled_reason;
    user.email = response.email;
    user.firstname = response.firstname;
    user.freelancer = response.freelancer;
    user.fullname = response.fullname;
    user.gtc_blocked = response.gtc_blocked;
    user.has_requested_password_reset = response.has_requested_password_reset;
    user.is_confirmed = response.is_confirmed;
    user.is_deactivated = response.is_deactivated;
    user.is_disabled = response.is_disabled;
    user.legal_blocked = response.legal_blocked;
    user.legal_reminder = response.legal_reminder;
    user.name = response.name;
    user.preamble = response.preamble;
    user.rights = response.rights;
    user.role = response.role;
    user.role_id = response.role_id;
    user.status = response.status;
    user.updated_at = response.updated_at;
    user.username = response.username;
    user.online =
      response.active_at &&
      moment
        .utc(response.active_at)
        .isAfter(moment().subtract(UserConfig.activeTime.value, 'minutes'));
    if (response.admin) {
      user.admin = response.admin;
    }
    if (response.agent && response.agent.data) {
      user.agent = response.agent.data;
    }

    return user;
  }

  searchRequest(search: UserSearchVM): SearchRequestVM {
    const searchRequest: SearchRequestVM = {};
    searchRequest.include = ['creator'];
    searchRequest.page = search.pageIndex;
    searchRequest.order_by = search.sortBy;
    searchRequest.order_dir = search.sortDir;
    searchRequest.limit = search.pageSize;
    searchRequest.filters = [];
    if (search.role) {
      searchRequest.filters.push({ key: 'role', value: search.role });
    }
    if (search.search) {
      searchRequest.filters.push({ key: 'search', value: search.search });
    }
    return searchRequest;
  }

  RoleResponseToVM(response: MultipleResponse<RoleResponse>): RoleVM[] {
    const roles: RoleVM[] = [];
    if (response.data?.length) {
      response.data.forEach((role) => {
        roles.push(role);
      });
    }

    return roles;
  }

  RightsResponseToVM(response: MultipleResponse<RightsResponse>): RightsVM[] {
    const rights: RightsVM[] = [];
    if (response.data?.length) {
      response.data.forEach((right) => {
        rights.push(right);
      });
    }

    return rights;
  }

  userVMToResponse(user: UserVM): UserResponse {
    const userResponse: UserResponse = {};

    userResponse.admin = user.admin;
    userResponse.agent = user.agent;
    userResponse.rights = user.rights;
    userResponse.email = user.email;
    userResponse.role = user.role;

    return userResponse;
  }

  agentVMToResponse(user: UserVM): AgentResponse {
    const agentResponse: AgentResponse = {};

    agentResponse.firstname = user?.agent?.firstname;
    agentResponse.lastname = user?.agent?.lastname;
    agentResponse.birthdate = user?.agent?.birthdate;
    agentResponse.email = user?.agent?.email;
    agentResponse.mobile = user?.agent?.mobile;
    agentResponse.gender = user?.agent?.gender;

    return agentResponse;
  }

  getByIdRequest(id: string): IdRequestVM {
    const searchRequest: IdRequestVM = {};
    searchRequest.id = id;
    searchRequest.include = ['requests'];
    return searchRequest;
  }
}
