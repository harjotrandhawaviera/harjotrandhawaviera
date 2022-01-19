import * as fromUser from './../root-state/user-state';
import * as userActions from './../root-state/user-state/user.actions';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { AuthService } from './../services/auth-service.service';
import { UserService } from './../services/user.service';
import { UserVM } from './../model/user.model';
import { environment } from '../../environments/environment';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent implements OnInit {
  appVersion = environment.appVersion;
  year: number;
  userInfo$: Observable<UserVM | null> = of(null);
  userInfo: UserVM | null = null;
  isOnboarding$: Observable<boolean | undefined> = of(undefined);
  menuFolded: boolean = false;
  smallDevice: boolean = false;
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private userStore: Store<fromUser.State>,
    breakpointObserver: BreakpointObserver,
    private router: Router
  ) {
    breakpointObserver.observe([
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.XSmall
    ]).subscribe(result => {
      if (result.matches) {
        this.menuFolded = true;
      } else {
        this.menuFolded = false;
      }
    });
    breakpointObserver.observe([
      Breakpoints.Small,
      Breakpoints.XSmall
    ]).subscribe(result => {
      if (result.matches) {
        this.smallDevice = true;
        this.menuFolded = true;
      } else {
        this.smallDevice = false;
        this.menuFolded = false;
      }
    });
    this.year = new Date().getFullYear();
  }

  ngOnInit(): void {
   var mainContent = document.getElementById("main-content");
   mainContent?.scrollIntoView()

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((res) => {
        if (this.smallDevice && !this.menuFolded) {
          this.menuFolded = true;
          document.getElementById('menu-collapse')?.scrollIntoView();
        }
      });
    this.userInfo$ = this.userStore.pipe(select(fromUser.getCurrentUserInfo));
    this.isOnboarding$ = this.userStore.pipe(select(fromUser.isOnboarding));
    this.userInfo$.subscribe((res) => {
      this.userInfo = res;
    });
    if (this.authService.isAuthenticated()) {
      this.userInfo$.subscribe((res) => {
        if (!res) {
          this.userService.getCurrentUser().subscribe((userResponse) => {
            this.userService.set(userResponse);
            this.userStore.dispatch(
              userActions.UserLoginSuccess({ user: userResponse.data })
            );
          });
        }
      });
    }
  }

  foldingPanel(folded: boolean) {
    this.menuFolded = folded;
    // const menu = document.getElementsByClassName('wrapper')[0];
    // const transition = 300;
    // if (folded) {
    //   // this.renderer.addClass(document.getElementById('sidebar'), 'active');
    //   // this.renderer.addClass(document.getElementById('content'), 'active');
    //   if (menu) {
    //     this.renderer.addClass(menu, 'menu-folding');
    //   }
    //   setTimeout(() => {
    //     this.renderer.addClass(menu, 'menu-folded');
    //     this.renderer.removeClass(menu, 'menu-folding');
    //   }, transition);
    // } else {
    //   // this.renderer.removeClass(document.getElementById('sidebar'), 'active');
    //   // this.renderer.removeClass(document.getElementById('content'), 'active');
    //   this.renderer.addClass(menu, 'menu-unfolding');
    //   setTimeout(() => {
    //     this.renderer.removeClass(menu, 'menu-unfolding');
    //     this.renderer.removeClass(menu, 'menu-folded');
    //   }, transition);
    // }
  }

  openOnboardingMenu() {
    this.menuFolded = false;
  }
  closeOnboardingMenu() {
    this.menuFolded = true;
  }
}
