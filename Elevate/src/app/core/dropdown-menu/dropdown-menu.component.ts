import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-dropdown-menu',
  templateUrl: './dropdown-menu.component.html',
  styleUrls: ['./dropdown-menu.component.scss']
})
export class DropdownMenuComponent {
  @Input()
  xPosition: 'before' | 'after' = 'after';

  timedOutCloser: any | undefined = undefined;
  @ViewChild('menuTrigger')
  menuTrigger?: MatMenuTrigger;

  constructor() { }

  mouseEnter(trigger: any) {
    if (this.timedOutCloser && this.menuTrigger?.menuOpen) {
      clearTimeout(this.timedOutCloser);
    }
  }

  mouseLeave(trigger: any) {
    if (this.menuTrigger?.menuOpen) {
      this.timedOutCloser = setTimeout(() => {
        trigger.closeMenu();
      }, 50);
    }
  }

}
