import { Observable, of } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userObject: any = null;
  public userData: any = null;
  onboardingRight = 'ONBOARDING'
  allowedActions: any = {
    'list-certificates': ['ROLE_ADMIN', 'ROLE_AGENT'],
    'update-certificates': ['ROLE_ADMIN', 'ROLE_AGENT'],
    'disable-users': ['MANAGE_USERS'],
    'delete-users': ['MANAGE_USERS'],
    'deactivate-users': ['MANAGE_USERS'],
    'deactivate-freelancers': ['MANAGE_USERS', 'MANAGE_FREELANCERS'],
    'view-logs': ['MANAGE_LOGS'],
    'create-users': ['MANAGE_USERS'],
    'manage-freelancers': ['MANAGE_FREELANCERS'],
    'manage-contacts': ['MANAGE_CONTACTS'],
    'manage-ratings': ['MANAGE_RATINGS'],
    'accept-offers': ['MANAGE_PROJECTS'],
    'manage-projects': ['MANAGE_PROJECTS'],
    'manage-clients': ['MANAGE_CUSTOMERS'],
    'manage-orders': ['MANAGE_ORDERS'],
    'manage-invoices': ['MANAGE_INVOICES'],
    'delete-orders': ['MANAGE_ORDERS'],
    'delete-clients': ['MANAGE_CUSTOMERS'],
    'delete-budgets': ['MANAGE_ORDERS'],
    'delete-projects': ['MANAGE_PROJECTS'],
    'reset-invoice': ['RESET_INVOICE']
  };
  constructor(private http: HttpClient) { }

  getCurrentUser(): Observable<any> {
    return this.http.get(environment.api + '/users/current');
  }
  set(obj: any) {
    this.userObject = obj;
    this.userData = this.userObject.data;
    this.assignRoleRights();
  }
  reset() {
    this.userObject = null;
    this.userData = null;
  }
  current() {
    return this.userObject;
  }

  get(): Observable<any> {
    if (this.userObject) {
      return of(this.userObject);
    } else {
      return this.getCurrentUser();
    }
  }

  refresh() {
    return this.getCurrentUser().subscribe(res => {
      this.userData = res.data;
    });
  }

  user() {
    /**
     * @returns {*} User id
     */
    const id = () => {
      return this.userData.id;
    }

    /**
     * @returns {*} User role id (ref to resources)
     */
    const roleId = () => {
      return this.userData.role_id;
    }

    /**
     * @returns {string} User name
     */
    const userName = () => {
      return this.userData && this.userData.name;
    }

    /**
     * @returns {string} User firstname
     */
    const firstname = () => {
      return this.userData && this.userData.firstname;
    }

    /**
     * @returns {string} User email
     */
    const email = () => {
      return this.userData && this.userData.email;
    }

    /**
     * @returns {string} User role
     */
    const role = () => {
      return this.userData && this.userData.role;
    }

    /**
     * Checks if user is in onboarding phase
     * @returns {boolean}
     */
    const onboarding = () => {
      return this.userData && this.userData.rights && this.userData.rights.includes(this.onboardingRight);
    }

    /**
     * returns status of the user
     * @returns {string} Status onboarding, active, unconfirmed, deleted
     */
    const status = () => {
      return this.userData.status;
    }

    /**
     * returns data (copy) of the user
     * @returns {object}
     */
    const data = () => {
      return { ...this.userData };
    }

    /**
     * Returns user home screen basis on rights/role
     * @returns {string} State name
     */
    const homescreen = () => {
      return (onboarding() && 'onboarding') || 'homescreen';
    }

    const hasPermission = (permissions: any) => {
      return permissions && (permissions.includes('ANY') ||
        permissions.filter((n: any) => {
          return this.userData && this.userData.rights && this.userData.rights.includes(n);
        }).length > 0);
    }

    const isAllowed = (action: any) => {
      if (this.allowedActions[action]) {
        return hasPermission(this.allowedActions[action]);
      }
      return false;
    }

    /**
     * checks legal blocking state for a contract type
     *  @param contractTypeIdentifier
     *  @returns {boolean}
     */
    const isLegalBlocked = (contractTypeIdentifier: any) => {
      return this.userData && this.userData.legal_blocked && this.userData.legal_blocked[contractTypeIdentifier];
    }

    /**
     *  checks legal reminder state for a contract type
     *  @param contractTypeIdentifier
     *  @returns {boolean}
     */
    const isLegalReminder = (contractTypeIdentifier: any) => {
      return this.userData && this.userData.legal_reminder && this.userData.legal_reminder[contractTypeIdentifier];
    }

    /**
     * checks gtc blocking state for a contract type
     * @param contractTypeIdentifier
     * @returns {boolean}
     */
    const isGtcBlocked = (contractTypeIdentifier: any) => {
      return this.userData && this.userData.gtc_blocked && this.userData.gtc_blocked[contractTypeIdentifier];
    }

    /**
     * checks of pending state for a contract type
     * @param contractTypeIdentifier
     * @returns {boolean}
     */
    const isContractTypePending = (contractTypeIdentifier: any) => {
      return this.userData && this.userData.contract_type_pending && this.userData.contract_type_pending[contractTypeIdentifier];
    }

    /**
     * Checks if user has role
     * @param {string} role - role to check; can be more than one, like user.is('admin', 'client')
     * @returns {boolean} True if any given role matches
     */
    const is = (role: any) => {  // eslint-disable-line no-unused-vars
      return !!this.userData && this.userData.role === role;
    }

    return {
      id: id,
      roleId: roleId,
      name: userName,
      firstname: firstname,
      email: email,
      onboarding: onboarding,
      homescreen: homescreen,
      hasPermission: hasPermission,
      isAllowed: isAllowed,
      status: status,
      data: data,
      role: role,
      isLegalBlocked: isLegalBlocked,
      isLegalReminder: isLegalReminder,
      isGtcBlocked: isGtcBlocked,
      isContractTypePending: isContractTypePending,
      is: is
    };



  }
  /**
     * Assign rights to internal usage basis on other user data
     * @returns {undefined}
     */
  assignRoleRights() {
    if (!this.userData.rights) {
      this.userData.rights = [];
    }
    if (this.userData.role === 'freelancer' || !this.userData.role) {
      if (this.userData.status === 'onboarding') {
        this.userData.rights.push(this.onboardingRight);
      } else {
        this.userData.rights.push('ROLE_FREELANCER');
      }
    } else {
      this.userData.rights.push('ROLE_' + (this.userData.role || 'undefined').toUpperCase());
    }
  }
}
