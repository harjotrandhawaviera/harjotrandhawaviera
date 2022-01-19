import { ApprovalActionTypes, ApprovalActions, LoadApprovalListFailed } from './approval.actions';
import { ApprovalRequestSearchVM, ApprovalRequestVM,ApprovalUserListVM, ApproveFreelancerEmail } from './../../model/approval-request.model';

import { EventLogVM } from './../../model/event-log.model';
import { PaginationVM } from './../../model/pagination.model';

export interface ApprovalState {
  searchModel?: ApprovalRequestSearchVM;
  resultList?: ApprovalRequestVM[];
  freelancerList?: ApproveFreelancerEmail[];
  userList?: ApprovalUserListVM[];
  userEmail?: ApprovalUserListVM[];
  loading: boolean;
  noRecord: boolean;
  pageInfo?: PaginationVM;

  eventLogSearchModel?: ApprovalRequestSearchVM;
  eventLogResultList?: EventLogVM[];
  eventLogLoading: boolean;
  eventLogNoRecord: boolean;
  eventLogPageInfo?: PaginationVM;
}

function initialState(): ApprovalState {
  const stored = localStorage.getItem('approval.search');
  const eventlogStored = localStorage.getItem('eventLog.search');
  return {
    searchModel: stored && stored !== null && stored !== undefined && stored !== 'null' && stored !== 'undefined' ? JSON.parse(stored) : {},
    resultList: [],
    loading: false,
    noRecord: false,
    pageInfo: {
      total: 0,
      current_page: 1,
      total_pages: 0,
    },

    eventLogSearchModel: eventlogStored && eventlogStored !== null && eventlogStored !== undefined && eventlogStored !== 'null' && eventlogStored !== 'undefined' ? JSON.parse(eventlogStored) : null,
    eventLogResultList: [],
    eventLogLoading: false,
    eventLogNoRecord: false,
    eventLogPageInfo: {
      total: 0,
      current_page: 1,
      total_pages: 0,
    },
  };
}
export function reducer(
  state = initialState(),
  action: ApprovalActions
): ApprovalState {
  switch (action.type) {
    case ApprovalActionTypes.UpdateSearch:
      localStorage.setItem('approval.search', JSON.stringify(action.payload));
      return {
        ...state,
        searchModel: action.payload,
      };
    case ApprovalActionTypes.LoadApprovalList:
      localStorage.setItem('approval.search', JSON.stringify(action.payload));
      return {
        ...state,
        loading: true,
        noRecord: false,
      };

    case ApprovalActionTypes.LoadApprovalListSuccess:
      localStorage.setItem('approval.search', JSON.stringify(state.searchModel));
      return {
        ...state,
        resultList: [...action.payload.list].reverse(),
        pageInfo: action.payload.pageInfo,
        noRecord: action.payload.list.length === 0,
        loading: false,
      };

    case ApprovalActionTypes.LoadApprovalListFailed:
      return {
        ...state,
        resultList: [],
        pageInfo: {},
        loading: false,
      };


    case ApprovalActionTypes.UpdateEventLogSearch:
      localStorage.setItem('eventLog.search', JSON.stringify(action.payload));
      return {
        ...state,
        eventLogSearchModel: action.payload,
      };
    case ApprovalActionTypes.LoadEventLogList:
      localStorage.setItem('eventLog.search', JSON.stringify(action.payload));
      return {
        ...state,
        eventLogLoading: true,
        eventLogNoRecord: false,
      };

    case ApprovalActionTypes.LoadEventLogListSuccess:
      localStorage.setItem('eventLog.search', JSON.stringify(state.searchModel));
      return {
        ...state,
        eventLogResultList: action.payload.list,
        eventLogPageInfo: action.payload.pageInfo,
        eventLogNoRecord: action.payload.list.length === 0,
        eventLogLoading: false,
      };

    case ApprovalActionTypes.LoadEventLogListFailed:
      return {
        ...state,
        eventLogResultList: [],
        eventLogPageInfo: {},
        eventLogLoading: false,
      };

      case ApprovalActionTypes.SendEmail:
        return  {
          ...state,
          loading: false,
          freelancerList: [],
        };

      case ApprovalActionTypes.SendEmailSuccess:
        return {
          ...state,
          loading: false,
          freelancerList: action.payload
        };

      case ApprovalActionTypes.LoadUserList:
        return  {
          ...state,
          loading: true,
          userList: [],
        };

      case ApprovalActionTypes.LoadUserListSuccess:
        return {
          ...state,
          userList: action.payload
        };

      case ApprovalActionTypes.UserEmailVerify:
        return  {
          ...state,
          loading: false,
          userEmail: [],
        };

      case ApprovalActionTypes.UserEmailVerifySuccess:
        return {
          ...state,
          loading: false,
          freelancerList: action.id
        };

    default:
      return state;
  }
}
