import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';

import { AuthService } from '../services/auth-service.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from './../services/translate.service';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';

// import { AdalService } from '@sedo/sedo-common-services';

@Injectable()
export class AppHttpErrorInterceptor implements HttpInterceptor {
  constructor(private toastrService: ToastrService,
    private translateService: TranslateService) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap(
        () => { },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 409 || error.status === 403) {
              console.log(error);
              if (error.error && error.error.message) {
                this.toastrService.error(error.error.message);
              } else {
                this.toastrService.error(error.message);
              }
            }
            if (error.status === 422) {
              if (error.error && error.error.message && !error.error.errors) {
                this.toastrService.error(error.error.message);
              } else if (error.error.errors) {
                const message: string[] = [];
                for (const key in error.error.errors) {
                  if (
                    Object.prototype.hasOwnProperty.call(
                      error.error.errors,
                      key
                    )
                  ) {
                    const element = error.error.errors[key];
                    if (Array.isArray(element)) {
                      element.forEach((el) => {
                        if (typeof el === 'string') {
                          message.push(el);
                        }
                      });
                    } else if (typeof element === 'string') {
                      message.push(element);
                    }
                  }
                }
                if (message && message.length > 0) {
                  const module = request.url.replace(environment.api, '').split('?')[0].replace(/(\/{.+?})|(^\/)/g, '').replace(/\//g, '-');
                  const errorCode = 'notification.' + request.method.toLowerCase() + `.${module.toLowerCase()}.error`;
                  this.translateService.get(errorCode).subscribe(res => {
                    this.toastrService.error(message.join('<br>'), res === errorCode ? null : res);
                  });

                }
              } else {
                this.toastrService.error(error.message);
              }
            }
          }
        }
      )
    );
  }
}
