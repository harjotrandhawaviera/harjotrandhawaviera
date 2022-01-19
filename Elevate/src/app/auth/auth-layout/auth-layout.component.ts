import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent implements OnInit {
  cookieSetAlready: string | null = '';
  constructor() { }

  ngOnInit(): void {
    this.cookieSetAlready = this.getCookie('agreedCookieUse');
  }

  cookieAccept(value: boolean) {
    if (value) {
      document.cookie = 'agreedCookieUse=yes';
      this.cookieSetAlready = 'yes';
    }
  }

  getCookie(cname: string) {
    const name = cname + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }

}
