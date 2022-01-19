import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Action } from "@ngrx/store";
import { Observable, of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { ContactResponse } from '../../model/contact.response';
import { ContactService } from '../../services/contact.service';
import { ContactMappingService } from '../../services/mapping-services';
import { MultipleResponse } from './../../model/response';
import * as fromContactAction from './contact.actions';

@Injectable()
export class ContactEffect {
  constructor(
    private contactService: ContactService,
    private actions$: Actions,
    private contactMappingService: ContactMappingService
  ) {

  }

  @Effect()
  loadContactList$: Observable<Action> = this.actions$.pipe(
    ofType(fromContactAction.ContactActionTypes.LoadContactList),
    map((action: fromContactAction.LoadContactList) => action.payload),
    switchMap(payload =>
      this.contactService.getContacts(this.contactMappingService.searchRequest(payload)).pipe(
        map((contactRes: MultipleResponse<ContactResponse>) => {
          return new fromContactAction.LoadContactListSuccess(this.contactMappingService.contactSearchResponseToVM(contactRes));
        }),
        catchError(err => of(new fromContactAction.LoadContactListFailed(err)))
      )
    )
  );
}
