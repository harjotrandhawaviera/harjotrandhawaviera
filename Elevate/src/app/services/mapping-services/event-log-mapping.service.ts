import { ApprovalRequestSearchVM, ApprovalRequestVM } from './../../model/approval-request.model';
import { BudgetResponse, RecordResponse } from './../../model/budget.response';
import { BudgetVM, RecordVM } from '../../model/budget.model';
import { EventLogSearchVM, EventLogVM } from './../../model/event-log.model';

import { ApprovalRequestResponse } from './../../model/approval-request.response';
import { AssignmentMappingService } from './assignment-mapping.service';
import { EventLogResponse } from './../../model/event-log.response';
import { Injectable } from "@angular/core";
import { MultipleResponse } from '../../model/response';
import { PagedResult } from '../../model/pagination.model';
import { SearchRequestVM } from '../../model/search.model';
import { SiteVM } from "../../model/site.model";

@Injectable()
export class EventLogMappingService {
  constructor() {

  }

  eventLogMultipleResponseToVM(response: MultipleResponse<EventLogResponse>): PagedResult<EventLogVM> {
    const obj: PagedResult<EventLogVM> = {
      pageInfo: { ...response.meta?.pagination },
      list: []
    };
    if (response.data?.length) {
      response.data.forEach(item => {
        const log: EventLogVM = item;
        obj.list.push(log);
      });
    }
    return obj;
  }
  searchRequest(search: EventLogSearchVM): SearchRequestVM {
    const searchRequest: SearchRequestVM = {};
    // searchRequest.include = ['user'];
    searchRequest.page = search.pageIndex;
    searchRequest.order_by = 'created_at';
    searchRequest.order_dir = 'desc';
    searchRequest.limit = search.pageSize;
    searchRequest.filters = [];
    searchRequest.filters.push({ key: 'eventnames', value: 'UserRequestDeclinedEvent,DataChangedEvent,FreelancerDeletedEvent' });
    searchRequest.filters.push({ key: 'only_freelancer', value: true });
    return searchRequest;
  }
}
