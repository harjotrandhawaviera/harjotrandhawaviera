import * as fromUser from './root-state/user-state';

import { Component, OnInit, Renderer2 } from '@angular/core';

import { AuthService } from './services/auth-service.service';
import { StorageService } from './services/storage.service';
import { Store } from '@ngrx/store';
import { TranslateService } from './services/translate.service';
import { UserService } from './services/user.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public appPages = [
    { title: 'Inbox', url: '/folder/Inbox', icon: 'mail' },
    { title: 'Outbox', url: '/folder/Outbox', icon: 'paper-plane' },
    { title: 'Favorites', url: '/folder/Favorites', icon: 'heart' },
    { title: 'Archived', url: '/folder/Archived', icon: 'archive' },
    { title: 'Trash', url: '/folder/Trash', icon: 'trash' },
    { title: 'Spam', url: '/folder/Spam', icon: 'warning' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  title = 'Elevate-UI';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private storageService: StorageService,
    private translateService: TranslateService,
    private userStore: Store<fromUser.State>,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {

  }

  foldingPanel(folded: boolean) {
    const menu = document.getElementById('page');
    const transition = 300;
    if (folded) {
      if (menu) {
        this.renderer.addClass(menu, 'menu-folding');
      }
      setTimeout(() => {
        this.renderer.addClass(menu, 'menu-folded');
        this.renderer.removeClass(menu, 'menu-folding');
      }, transition);
    } else {
      this.renderer.addClass(menu, 'menu-unfolding');
      setTimeout(() => {
        this.renderer.removeClass(menu, 'menu-unfolding');
        this.renderer.removeClass(menu, 'menu-folded');
      }, transition);
    }
  }
}
