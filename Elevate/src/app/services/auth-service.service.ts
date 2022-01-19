import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) { }

  login(user: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(environment.api + '/auth/login', user);
  }
  signUp(user: { email: string; password: string }) {
    return this.http.post<any>(environment.api + '/auth/register', user);
  }
  resetPassword(payload: { email: string }) {
    return this.http.post<any>(environment.api + '/auth/reset-password', payload);
  }
  resendConfirmation(payload: { email: string }) {
    return this.http.post<any>(environment.api + '/auth/resend-confirmation', payload);
  }
  confirm(payload: { type: string, token: string }) {
    return this.http.post(environment.api + `/confirm/${payload.type}`, { token: payload.token });
  }
  getRefreshToken(): Observable<any> {
    return this.http.get<any>(environment.api + '/auth/refresh-token');
  }
  logOut() {
    this.storageService.clearAll();
  }
  setToken(token: string | null) {
    if (token) {
      this.storageService.set('token', token);
    } else {
      this.storageService.clear('token');
    }
  }
  getToken() {
    return this.storageService.get('token');
  }
  hasToken(): boolean {
    return !!this.storageService.get('token');
  }
  isAuthenticated() {
    const token = this.getToken();
    if (token) {
      if (token.split('.').length === 3) {
        try {
          var base64Url = token.split('.')[1];
          var base64 = base64Url.replace('-', '+').replace('_', '/');
          var exp = JSON.parse(window.atob(base64)).exp;
          if (typeof exp === 'number') {
            return Math.round(new Date().getTime() / 1000) < exp;
          }
        } catch (e) {
          return false; // Pass: Non-JWT token that looks like JWT
        }
      }
      return false; // Pass: All other tokens
    }
    return false; // Fail: No token at all
  }
}
