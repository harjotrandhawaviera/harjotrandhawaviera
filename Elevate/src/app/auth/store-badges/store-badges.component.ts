import { Component, OnInit } from '@angular/core';

import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-store-badges',
  templateUrl: './store-badges.component.html',
  styleUrls: ['./store-badges.component.scss'],
})
export class StoreBadgesComponent implements OnInit {
  stores: { type: string; url: string; img: string }[];

  constructor() {
    this.stores = environment.store;
  }

  ngOnInit(): void {}
}
