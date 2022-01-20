import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { AppService } from 'src/controller/app.service';
import { MatDrawerMode } from '@angular/material/sidenav';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-search-container',
  templateUrl: './search-container.component.html',
  styleUrls: ['./search-container.component.scss']
})
export class SearchContainerComponent implements OnInit, OnDestroy {
  @Input()
  showSearchPanel = true;
  mode: MatDrawerMode = 'side';
  hasBackdrop = false;
  smallDevice = false;
  appVersion = environment.appVersion;
  year: number;

  constructor(breakpointObserver: BreakpointObserver, public app: AppService) {
    breakpointObserver.observe([
      Breakpoints.Small,
      Breakpoints.XSmall
    ]).subscribe(result => {
      if (result.matches) {
        this.mode = 'over';
        this.hasBackdrop = true;
        this.app.searchContainer.opened = false;
        this.smallDevice = true;
      } else {
        this.mode = 'side';
        this.hasBackdrop = false;
        this.app.searchContainer.opened = true;
        this.smallDevice = false;
      }
    });
    this.year = new Date().getFullYear();
  }

  ngOnInit(): void {
    const mainContent = document.querySelector('.main-content');
    if (mainContent?.querySelectorAll('.search-container')) {
      document.querySelector('.main-content')?.classList.add('has-searchpanel');
    }
  }
  openFilter() {
    this.app.searchContainer.opened = true;
  }
  closeFilter() {
    this.app.searchContainer.opened = false;
  }
  ngOnDestroy(): void {
    document.querySelector('.main-content')?.classList.remove('has-searchpanel');
  }
}
