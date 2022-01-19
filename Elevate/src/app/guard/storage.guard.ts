import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { Injectable } from '@angular/core';
import { StorageService } from '../services/storage.service';

@Injectable()
export class StorageGuard implements CanActivate {
  constructor(private router: Router, private storageService: StorageService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Promise<boolean> {
    if (route && route.routeConfig && route.routeConfig.path) {
      localStorage.removeItem('user.search');
      localStorage.removeItem('client.search');
      localStorage.removeItem('contact.search');
      localStorage.removeItem('job.search');
      localStorage.removeItem('project.search');
      localStorage.removeItem('dates.search');
      localStorage.removeItem('assignment.search');
      localStorage.removeItem('customer-assignment.search');
      localStorage.removeItem('checkin.search');
      localStorage.removeItem('freelancer.search');
      this.storageService.clear('admin.budget.search');
      this.storageService.clear('admin.order.search');
      this.storageService.clear('budget.search');
      this.storageService.clear('admin.invoice.search');
      this.storageService.clear('invoice.search');
      return true;
    } else {
      return false;
    }
  }
}
