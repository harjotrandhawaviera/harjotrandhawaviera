import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';

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
  opened = true;
  smallDevice = false;
  appVersion = environment.appVersion;
  year: number;
  constructor(breakpointObserver: BreakpointObserver) {
    breakpointObserver.observe([
      Breakpoints.Small,
      Breakpoints.XSmall
    ]).subscribe(result => {
      if (result.matches) {
        this.mode = 'over';
        this.hasBackdrop = true;
        this.opened = false;
        this.smallDevice = true;
      } else {
        this.mode = 'side';
        this.hasBackdrop = false;
        this.opened = true;
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
    this.opened = true;
  }
  closeFilter() {
    this.opened = false;
  }
  ngOnDestroy(): void {
    document.querySelector('.main-content')?.classList.remove('has-searchpanel');
  }
}
