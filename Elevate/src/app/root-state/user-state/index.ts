import { AllowedActions } from './../../constant/allowed-actions.constant';
import { IMenuConfig } from './../../constant/menu.constant';
/* NgRx */

import * as fromRoot from '../../root-state';
import * as fromUser from './user.reducer';

import { createFeatureSelector, createSelector } from '@ngrx/store';

import { MenuConfig } from '../../constant/menu.constant';

export interface State extends fromRoot.State {
  currentUser: fromUser.CurrentUserState;
}
// Selector functions
const getCurrentUserState = createFeatureSelector<fromUser.CurrentUserState>(
  'user'
);
export const getCurrentUserInfo = createSelector(
  getCurrentUserState,
  (state) => state.user
);
export const isOnboarding = createSelector(
  getCurrentUserInfo,
  (user) => user?.rights && user.rights.includes('ONBOARDING')
);
export const getUserRight = createSelector(
  getCurrentUserInfo,
  (user) => user && user.rights ? user.rights : []
);
export const getUserRole = createSelector(
  getCurrentUserInfo,
  (user) => user && user.role ? user.role : undefined
);
export const getUserRoleId = createSelector(
  getCurrentUserInfo,
  (user) => user && user.role_id ? user.role_id : undefined
);
export const isAllowed = createSelector(
  getUserRight,
  (rights: string[], props: { permissions: string[] }) => {
    return props.permissions && (props.permissions.includes('ANY') || props.permissions.filter((n) => {
      return rights && rights.includes(n);
    }).length > 0)
  }
);
export const getMenu = createSelector(
  getUserRight,
  (rights: string[], props: { menu: IMenuConfig[] }) => {
    return props.menu.filter((item: any) => {
      if (item.items) {
        item.items = [...item.items].filter((a: any) => {
          return (
            !a.invisible &&
            a.permission &&
            (a.permission.includes('ANY') ||
              a.permission.filter((n: string) => {
                return rights && rights.includes(n);
              }).length > 0)
          );
        }).map((a: any) => {
          return { ...a };
        });
      }
      return (
        !item.invisible &&
        item.permission &&
        (item.permission.includes('ANY') ||
          item.permission.filter((n: string) => {
            return rights && rights.includes(n);
          }).length > 0)
      );
    }).map((a: any) => {
      return { ...a };
    });
  }
);

// export const getMenu = createSelector(getUserRight, (rights) => {
//   return rights ? [...MenuConfig].filter((item: any) => {
//     if (item.items) {
//       item.items = [...item.items].filter((a: any) => {
//         return (
//           !a.invisible &&
//           a.permission &&
//           (a.permission.includes('ANY') ||
//             a.permission.filter((n: string) => {
//               return rights && rights.includes(n);
//             }).length > 0)
//         );
//       }).map((a: any) => {
//         return { ...a };
//       });
//     }
//     return (
//       !item.invisible &&
//       item.permission &&
//       (item.permission.includes('ANY') ||
//         item.permission.filter((n: string) => {
//           return rights && rights.includes(n);
//         }).length > 0)
//     );
//   }).map((a: any) => {
//     return { ...a };
//   }) : [];
// });
