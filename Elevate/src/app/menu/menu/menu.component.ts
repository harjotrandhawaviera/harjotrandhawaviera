/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */

import * as fromCurrentUser from '../../root-state/user-state';
import * as fromUser from './../../root-state/user-state';

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { MatDialog } from '@angular/material/dialog';
import { MenuConfig } from './../../constant/menu.constant';
import { OptionVM } from '../../model/option.model';
import { StorageService } from '../../services/storage.service';
import { Subscription } from 'rxjs';
import { TodosFacade } from '../../todos/+state/todos.facade';
import { TodosModalComponent } from '../../todos/todos-modal/todos-modal.component';
import { TranslateService } from './../../services/translate.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  menu: any[] = [];
  expanded = '';
  @Input()
  folded = false;
  @Output() foldingPanel: EventEmitter<boolean> = new EventEmitter();
  rightsSub?: Subscription;
  language: string | null = '';
  agentList: OptionVM | any;
  loggedRole: string | undefined = '' ;
  constructor(
    private translateService: TranslateService,
    private storageService: StorageService,
    private userStore: Store<fromUser.State>,
    private dialog: MatDialog,
    private todoFacade: TodosFacade,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.language = this.storageService.get('language');
    this.getMenu();

    this.store.select(fromCurrentUser.getCurrentUserInfo).subscribe((res) => {
      this.loggedRole = res?.role;
      if (res) {
        // @ts-ignore
        if (!(res.role === 'field' || res.role === 'freelancer')) {
          this.todoFacade.loadClientList();
          this.todoFacade.getAgentList$.subscribe((lists: any) => {
            this.agentList =  this.sortOption(
              lists.data
                ? lists.data.map((a: any) => ({
                    value: a.id,
                    text: a.lastname + ' ' + a.firstname,
                    owner_id: a.user?.data?.id
                  }))
                : []
            );
          });
        }
      }
    });
  }
  setLanguage(language: string) {
    this.language = language;
    this.storageService.set('language', language);
    location.reload();
  }
  /**
   *
   *
   * Processes menu options from config by filtering per rights
   *
   *
   *
   * @returns Then menu options
   */
  getMenu() {
    this.rightsSub = this.userStore
      .pipe(select(fromUser.getUserRight))
      .subscribe((res) => {
        if (res) {
          const menuConfig = MenuConfig.map((a) => ({
              ...a,
              items: a.items?.map((x) => ({ ...x })),
            }));
          this.userStore
            .pipe(select(fromUser.getMenu, { menu: menuConfig }))
            .subscribe((res) => {
              this.menu = this.setLabel(res ?? [], []);
              if (this.rightsSub) {
                this.rightsSub.unsubscribe();
              }
            });
        }
      });
  }

  setLabel(menu: any[], approvals: any[]) {
    return menu.map((entry: any) =>
      // add translated label
       this.mapMenu({ ...entry }, approvals)
    );
  }

  private mapMenu(entry: any, approvals: any[]) {
    entry.label = entry.label
      ? entry.label
      : 'menu.' +
        entry.name.replace('app.', '') +
        (entry.items ? '.group' : '');
    entry.class = entry.class || [];
    // subentries
    if (entry.items) {
      entry.items.map((e: any) =>
        // add translated label
         this.mapMenu(e, approvals)
      );
    }
    // approval states added as classes
    if (approvals && entry.name.substring(0, 12) === 'app.profile.') {
      const part = entry.name.match(/app\.profile\.([a-z_]+)/)[1];
      entry.class.push('approval', approvals[part] && approvals[part].state);
    }

    return entry;
  }

  toggleFold() {
    this.folded = !this.folded;
    this.foldingPanel.emit(this.folded);
  }

  addTasks() {
    if (this.agentList) {
      const dialogRef = this.dialog.open(TodosModalComponent, {
        data: {
          isEdit: false,
          agent: this.agentList
        }
      });
      dialogRef.afterClosed().subscribe((res) => {
        if (res) {
          const date = res?.modelValue?.completeBy;
          const newDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000 ))
            .toISOString()
            .split('T')[0];
          const selectedOwner = this.agentList.find((agent: any) => agent.value === res?.modelValue?.agent);
          const addModalObject = {
            owner_id: selectedOwner?.owner_id,
            subject: res?.modelValue?.content,
            important: res?.modelValue?.important,
            target_at:  newDate + ' 00:00:00'
          };
          this.todoFacade.addTodo(addModalObject);
          dialogRef.close();
        }
      });
    }
  }

  sortOption(options: OptionVM[]) {
    return options.sort((a: OptionVM, b: OptionVM) =>
      a.text && b.text ? (a.text > b.text ? 1 : b.text > a.text ? -1 : 0) : 0
    );
  }

  onClickMenu(){
    localStorage.removeItem('viewing');
  }
}
