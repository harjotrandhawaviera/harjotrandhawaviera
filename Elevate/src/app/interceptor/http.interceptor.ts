import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';

import { AuthService } from '../services/auth-service.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from './../services/storage.service';
import { environment } from './../../environments/environment';

// import { AdalService } from '@sedo/sedo-common-services';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private storageService: StorageService) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request.url.indexOf('assets') === -1) {
      if (
        environment.api &&
        request.url.indexOf(environment.api) >= 0
      ) {
        return this.handleApiCalls(request, next);
      } else {
        return next.handle(request);
      }
    } else {
      return next.handle(request);
    }
  }

  handleApiCalls(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let customHeaders = new HttpHeaders();
    customHeaders = request.headers;
    let doNotIncludeContentType = false;
    if (request.headers.get('Content-Type') === 'multipart/form-data') {
      customHeaders = customHeaders.delete('Content-Type');
      doNotIncludeContentType = true;
    }
    if (request.url.indexOf('/pictures/') === -1 && !doNotIncludeContentType) {
      if (request.headers.get('Accept') === null) {
        customHeaders = customHeaders.append('Accept', 'application/json');
      }
      if (request.headers.get('Content-Type') === null) {
        customHeaders = customHeaders.append('Content-Type', 'application/json');
      }
    }

    const currentLang = this.storageService.get('language');
    if (currentLang !== null) {
      customHeaders = customHeaders.append('Accept-Language', currentLang);
    } else {
      customHeaders = customHeaders.append('Accept-Language', 'de');
    }
    if (this.authService.getToken()) {
      const authHeader = `bearer ${this.authService.getToken()}`;
      customHeaders = customHeaders.append('Authorization', authHeader);
    }
    return next.handle(request.clone({ headers: customHeaders }));
  }
}
