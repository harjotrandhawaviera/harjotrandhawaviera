import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Params } from '@angular/router';

@Component({
  selector: 'app-search-panel',
  templateUrl: './search-panel.component.html',
  styleUrls: ['./search-panel.component.scss'],
})
export class SearchPanelComponent implements OnInit {
  @Input() key: string = '';
  @Input() actions: { key: string; link?: string; text: string, permission: boolean | null | undefined,
    query?: Params | null | undefined }[] = [];
  @Input() header: string = '';

  @Output() action = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}

  actionClick(key: string) {
    this.action.emit(key);
  }
}
