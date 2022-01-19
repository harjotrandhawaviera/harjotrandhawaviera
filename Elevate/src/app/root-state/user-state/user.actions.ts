import { createAction, props } from '@ngrx/store';

import { UserVM } from '../../model/user.model';

export enum UserActionTypes {
  UserLoginSuccess = '[User] User login success',
  UserLogoutSuccess = '[User] User logout success',
  LanguageChange = '[User] Language change',
}
export const UserLoginSuccess = createAction(
  UserActionTypes.UserLoginSuccess,
  props<{ user: UserVM }>()
);
export const UserLogoutSuccess = createAction(
  UserActionTypes.UserLogoutSuccess
);
export const LanguageChange = createAction(
  UserActionTypes.LanguageChange,
  props<{ lang: string }>()
);
