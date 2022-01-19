import * as UserActions from './user.actions';

import { Action, State, createReducer, on } from '@ngrx/store';

import { UserVM } from '../../model/user.model';

export interface CurrentUserState {
  user: UserVM | null;
  isLogIn: boolean;
  language: string;
}
function getLanguage() {
  const persisted = localStorage.getItem('language');
  const updatedState = persisted ? persisted : null;
  if (updatedState) {
    return updatedState;
  } else {
    return '';
  }
}
const initialState: CurrentUserState = {
  user: null,
  isLogIn: false,
  language: getLanguage(),
};
export const userReducer = createReducer(
  initialState,
  on(UserActions.UserLoginSuccess, (state, { user }) => {
    const updatedRights = user.rights ? [...user.rights] : [];
    if (user.role === 'freelancer' || !user.role) {
      if (user.status === 'onboarding') {
        updatedRights.push('ONBOARDING');
      } else {
        updatedRights.push('ROLE_FREELANCER');
      }
    } else {
      updatedRights.push('ROLE_' + (user.role || 'undefined').toUpperCase());
    }
    return {
      ...state,
      isLogIn: true,
      user: { ...user, rights: updatedRights },
    };
  }),
  on(UserActions.UserLogoutSuccess, (state) => {
    return {
      ...state,
      isLogIn: false,
      user: null,
    };
  }),
  on(UserActions.LanguageChange, (state, { lang }) => {
    localStorage.setItem('language', lang);
    const currentLang = getLanguage();
    return {
      ...state,
      language: currentLang,
    };
  })
);
export function reducer(state: any | undefined, action: Action) {
  return userReducer(state, action);
}
