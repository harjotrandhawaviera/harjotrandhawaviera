import * as fromClient from './index';
import * as fromClientAction from './client.actions';

import { Action, Store } from "@ngrx/store";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { MultipleResponse, SingleResponse } from './../../model/response';
import { Observable, forkJoin, of } from "rxjs";
import { catchError, exhaustMap, map, switchMap, tap, withLatestFrom } from "rxjs/operators";

import { ClientMappingService } from "../../services/mapping-services/client-mapping.service";
import { ClientResponse } from '../../model/client.response';
import { ClientSearchVM } from './../../model/client.model';
import { ClientService } from "../../services/client.service";
import { ContactMappingService } from '../../services/mapping-services/contact-mapping.service';
import { ContactResponse } from '../../model/contact.response';
import { HttpResponse } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from './../../services/translate.service';

@Injectable()
export class ClientEffect {
  constructor(
    private clientService: ClientService,
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private actions$: Actions,
    private router: Router,
    private store: Store<fromClient.State>,
    private clientMappingService: ClientMappingService,
    private contactMappingService: ContactMappingService
  ) {

  }

  @Effect()
  loadClientList$: Observable<Action> = this.actions$.pipe(
    ofType(fromClientAction.ClientActionTypes.LoadClientList),
    map((action: fromClientAction.LoadClientList) => action.payload),
    switchMap(payload =>
      this.clientService.getClients(this.clientMappingService.searchRequest(payload)).pipe(
        map((clientRes: MultipleResponse<ClientResponse>) => {
          return new fromClientAction.LoadClientListSuccess(this.clientMappingService.searchResponseToVM(clientRes));
        }),
        catchError(err => of(new fromClientAction.LoadClientListFailed(err)))
      )
    )
  );

  @Effect()
  deleteClient$: Observable<Action> = this.actions$.pipe(
    ofType(fromClientAction.ClientActionTypes.DeleteClient),
    withLatestFrom(
      this.store.select(fromClient.getSearchModel),
      (action: fromClientAction.DeleteClient, model: ClientSearchVM) => {
        return {
          id: action.payload,
          searchModel: model
        };
      }
    ),
    switchMap((payload: any) =>
      forkJoin([this.clientService.deleteClient(payload.id), of(payload.searchModel)])
    ),
    switchMap((payload: any) => {
      if (payload[0].status === 204) {
        return of(new fromClientAction.LoadClientList(payload[1]));
      } else {
        return of(new fromClientAction.LoadClientList(payload[1]));
      }
    })
  );


  @Effect()
  loadClientDetail$: Observable<Action> = this.actions$.pipe(
    ofType(fromClientAction.ClientActionTypes.LoadClientDetail),
    map((action: fromClientAction.LoadClientDetail) => action.payload),
    switchMap(payload =>
      this.clientService.getClientById(this.clientMappingService.getByIdRequest(payload)).pipe(
        map((clientRes: SingleResponse<ClientResponse>) => {
          if (clientRes?.data) {
            return new fromClientAction.LoadClientDetailSuccess(this.clientMappingService.clientResponseToVM(clientRes.data));
          } else {
            return new fromClientAction.LoadClientDetailFailed(clientRes);
          }
        }),
        catchError(err => of(new fromClientAction.LoadClientDetailFailed(err)))
      )
    )
  );

  @Effect()
  loadClientContactList$: Observable<Action> = this.actions$.pipe(
    ofType(fromClientAction.ClientActionTypes.LoadClientContacts),
    map((action: fromClientAction.LoadClientContacts) => action.payload),
    switchMap(payload =>
      this.clientService.getClientContactByClientId(payload, { include: ['contact', 'user'] }).pipe(
        map((clientRes: MultipleResponse<ContactResponse>) => {
          return new fromClientAction.LoadClientContactsSuccess(this.contactMappingService.contactSearchResponseToVM(clientRes).list);
        }),
        catchError(err => of(new fromClientAction.LoadClientContactsFailed(err)))
      )
    )
  );


  @Effect()
  deleteContact$: Observable<Action> = this.actions$.pipe(
    ofType(fromClientAction.ClientActionTypes.DeleteContact),
    map((action: fromClientAction.DeleteContact) => action.payload),
    switchMap(payload =>
      this.clientService.deleteContact(payload).pipe(
        map((res: Response) => {
          return new fromClientAction.LoadClientContacts(payload.clientId);
        }),
        catchError(err => of(new fromClientAction.LoadClientContacts(payload.clientId)))
      )
    )
  );

  // @Effect()
  // createContact$: Observable<Action> = this.actions$.pipe(
  //   ofType(fromClientAction.ClientActionTypes.CreateContact),
  //   map((action: fromClientAction.CreateContact) => action.payload),
  //   switchMap(payload =>
  //     this.clientService.createContact({ clientId: payload.clientId, contact: payload.contact }).pipe(
  //       map((res: Response) => {
  //         if (res.status === 200) {
  //           return new fromClientAction.LoadClientContacts(payload.clientId);
  //         } else {
  //           return new fromClientAction.LoadClientContacts(payload.clientId);
  //         }
  //       }),
  //       catchError(err => of(new fromClientAction.LoadClientContacts(payload.clientId)))
  //     )
  //   )
  // );
  @Effect()
  createContact$: Observable<Action> = this.actions$.pipe(
    ofType(fromClientAction.ClientActionTypes.CreateContact),
    map((action: fromClientAction.CreateContact) => action.payload),
    switchMap(payload =>
      forkJoin([of(payload), this.clientService.createContact({ contact: this.contactMappingService.contactVMToResponse(payload.contact) })])
    ),
    switchMap(payload => {
      if (payload[1].status === 201 && payload[1].body?.data?.id) {
        return forkJoin([of(payload[0]), of(payload[1]), this.clientService.createClientContact({ id: payload[1].body.data.id, clientId: payload[0].clientId, contact: this.contactMappingService.contactVMToResponse(payload[0].contact) })]);
      } else {
        return forkJoin([of(payload[0]), of(payload[1]), of(null)]);
      }
    }
    ),
    switchMap((payload: any) => {
      if (payload[1].status === 201) {
        this.toastrService.success(this.translateService.instant('notification.post.contacts.success'));
        return of(new fromClientAction.LoadClientContacts(payload[0].clientId));
      } else {
        this.toastrService.error(this.translateService.instant('notification.post.contacts.error'));
        return of(new fromClientAction.LoadClientContacts(payload[0].clientId));
      }
    })
  );

  @Effect()
  createClient$: Observable<Action> = this.actions$.pipe(
    ofType(fromClientAction.ClientActionTypes.CreateClient),
    map((action: fromClientAction.CreateClient) => action.payload),
    exhaustMap(payload =>
      this.clientService.createClient({ client: this.clientMappingService.clientVMToResponse(payload.client) }).pipe(
        map((res: HttpResponse<SingleResponse<ClientResponse>>) => {
          if (res.body && res.body.data && res.body.data.id) {
            this.toastrService.success(this.translateService.instant('notification.post.clients.success'));
            return new fromClientAction.CreateClientSuccess({ id: res.body.data.id, backToProject: payload.backToProject });
          } else {
            this.toastrService.error(this.translateService.instant('notification.post.clients.error'));
            return new fromClientAction.CreateClientFailed(res);
          }
        }),
        catchError(err => of(new fromClientAction.CreateClientFailed(err)))
      )
    )
  );

  @Effect({ dispatch: false })
  createClientSuccess$ = this.actions$.pipe(
    ofType(fromClientAction.ClientActionTypes.CreateClientSuccess),
    map((action: fromClientAction.CreateClientSuccess) => action.payload),
    tap((payload) => {
      const route: any[] = ['administration/clients', payload.id];
      if (payload.backToProject) {
        route.push({backToProject: true});
      }
      // this.router.navigate(['/administration/clients']);
      this.router.navigate(route);
    })
  );

  @Effect()
  updateContact$: Observable<Action> = this.actions$.pipe(
    ofType(fromClientAction.ClientActionTypes.UpdateContact),
    map((action: fromClientAction.UpdateContact) => action.payload),
    switchMap(payload =>
      // tslint:disable-next-line:max-line-length
      forkJoin([of(payload), this.clientService.updateContact({ id: payload.id, contact: this.contactMappingService.contactVMToResponse(payload.contact) })])
    ),
    switchMap(payload =>
      // tslint:disable-next-line:max-line-length
      forkJoin([of(payload[0]), of(payload[1]), this.clientService.updateClientContact({ id: payload[0].id, clientId: payload[0].clientId, contact: this.contactMappingService.contactVMToResponse(payload[0].contact) })])
    ),
    switchMap((payload: any) => {
      if (payload[1].status === 200) {
        this.toastrService.success(this.translateService.instant('notification.post.contacts.success'));
        return of(new fromClientAction.LoadClientContacts(payload[0].clientId));
      } else {
        this.toastrService.error(this.translateService.instant('notification.post.contacts.error'));
        return of(new fromClientAction.LoadClientContacts(payload[0].clientId));
      }
    })
  );


  @Effect()
  updateClient$: Observable<Action> = this.actions$.pipe(
    ofType(fromClientAction.ClientActionTypes.UpdateClient),
    map((action: fromClientAction.UpdateClient) => action.payload),
    exhaustMap(payload =>
      this.clientService.updateClient({ client: this.clientMappingService.clientVMToResponse(payload.client) }).pipe(
        map((res: HttpResponse<SingleResponse<ClientResponse>>) => {
          if (res.body && res.body.data && res.body.data.id) {
            this.toastrService.success(this.translateService.instant('notification.post.clients.success'));
            return new fromClientAction.UpdateClientSuccess({ id: res.body.data.id });
          } else {
            this.toastrService.error(this.translateService.instant('notification.post.clients.error'));
            return new fromClientAction.UpdateClientFailed(res);
          }
        }),
        catchError(err => of(new fromClientAction.UpdateClientFailed(err)))
      )
    )
  );

  @Effect({ dispatch: false })
  updateClientSuccess$ = this.actions$.pipe(
    ofType(fromClientAction.ClientActionTypes.UpdateClientSuccess),
    map((action: fromClientAction.UpdateClientSuccess) => action.payload),
    tap((payload) => {
      this.router.navigate(['administration/clients', payload.id]);
    })
  );
}
