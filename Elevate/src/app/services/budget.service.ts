import { HttpClient, HttpResponse } from '@angular/common/http';
import { IdRequestVM, SearchRequestVM } from './../model/search.model';
import { MultipleResponse, SingleResponse } from '../model/response';

import { BaseService } from './base.service';
import { BudgetResponse } from './../model/budget.response';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class BudgetService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }
  getBudgets(searchRequest: SearchRequestVM): Observable<MultipleResponse<BudgetResponse>> {
    return this.http.get<MultipleResponse<BudgetResponse>>(environment.api + this.getSearchURL('/budgets', searchRequest));
  }

  getBudgetById(idRequest: IdRequestVM): Observable<SingleResponse<BudgetResponse>> {
    return this.http.get<SingleResponse<BudgetResponse>>(
      environment.api + this.getByIdURL('/budgets', idRequest)
    );
  }
  createBudget(budget: BudgetResponse): Observable<HttpResponse<SingleResponse<BudgetResponse>>> {
    return this.http.post(environment.api + '/budgets', budget, { observe: 'response' });
  }
  updateBudget(id: number, budget: BudgetResponse): Observable<HttpResponse<SingleResponse<BudgetResponse>>> {
    return this.http.post(environment.api + `/budgets/${id}`, budget, { observe: 'response' });
  }
  deleteBudget(id: number): Observable<any> {
    return this.http.delete(environment.api + `/budgets/${id}`, { observe: 'response' });
  }
  updateBudgetContacts(id: number, contacts: { contact_ids: any[] }) {
    return this.http.put(environment.api + `/budgets/${id}/contacts`, contacts, { observe: 'response' });
  }
  getRecords(id: number, searchRequest: SearchRequestVM): Observable<MultipleResponse<any>> {
    //  `/budgets/${id}/records?include=creator`
    return this.http.get<MultipleResponse<any>>(environment.api + this.getSearchURL(`/budgets/${id}/records`, searchRequest));
  }
  createRecord(budgetId: number, value: number, comment: string) {
    return this.http.post(environment.api + `/budgets/${budgetId}/records`, {
      id: budgetId,
      value: value,
      comment: comment
    }, { observe: 'response' });
  }

}
