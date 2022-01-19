import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormConfig } from '../constant/forms.constant';
import { TranslateService } from '../services/translate.service';
import { OptionVM } from '../model/option.model';
import { TodosFacade } from './+state/todos.facade';
import { Observable, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { TodosModalComponent } from './todos-modal/todos-modal.component';
import { ReasonBoxComponent } from '../core/reason-box/reason-box.component';
import { TodosSearchVM } from '../model/todos.model';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TodosComponent implements OnInit {
  searchModel: TodosSearchVM = {};
  todosForm = new FormGroup({
    agent: new FormControl(''),
    status: new FormControl(['open']),
    created_by: new FormControl(''),
    search: new FormControl(''),
  });
  stateLK: OptionVM[] = [];
  agentList: OptionVM | any;
  creatorList: OptionVM | any;
  todoList: OptionVM | any;
  hasFilter = false;
  noRecords$: Observable<boolean> = of(false);
  loading$: Observable<boolean> = of(false);
  totalRecords = 0;
  currentPage = 1;
  pagesize = 1;
  constructor(private translateService: TranslateService,
              private todoFacade: TodosFacade,
              private dialog: MatDialog,
              private userSvc: UserService) { }

  ngOnInit(): void {
    this.todoFacade.loadClientList();
    const statusInit = this.todosForm.value.status;
    this.todoFacade.loadTodoList({ pageIndex: 1, status: statusInit });
    const status = this.todosForm.value.status;
    this.searchModel = { ...this.searchModel, pageIndex: 1, status};
    const userId = this.userSvc.user().id();
    const userRole = this.userSvc.user().role();
    this.todoFacade.getAgentList$.subscribe((lists: any) => {
      this.agentList =  this.sortOption(
        lists.data
          ? lists.data.map((a: any) => {
            return {
              value: a.id,
              text: a.lastname + ' ' + a.firstname,
              owner_id: a.user?.data?.id
            };
          })
          : []
      );

      this.creatorList =  this.sortOption(
        lists.data
          ? lists.data.map((a: any) => {
            return {
              value: a.user?.data?.id,
              text: a.lastname + ' ' + a.firstname,
            };
          })
          : []
      );
    });
    this.todosForm.get('agent')?.valueChanges.subscribe((res) => {
      const statusId = this.todosForm.value.status;
      this.searchModel = { ...this.searchModel, pageIndex: 1, client_id: res, status: statusId};
      this.todoFacade.loadTodoList({ client_id: res, status: statusId });
    });

    this.todosForm.get('status')?.valueChanges.subscribe((res) => {
      let status = res;
      if (status.length === 2) {
        status = '';
      }
      const agentId = this.todosForm.value?.agent;
      this.searchModel = { ...this.searchModel, pageIndex: 1, client_id: agentId, status};
      this.todoFacade.loadTodoList({ status, client_id: agentId });
    });

    this.todosForm.get('created_by')?.valueChanges.subscribe((res) => {
      const statusId = this.todosForm.value.status;
      const agentId = this.todosForm.value?.agent;
      this.searchModel = { ...this.searchModel, pageIndex: 1, client_id: agentId, status: statusId, created_by: res};
      this.todoFacade.loadTodoList({ created_by: res, status: statusId, client_id: agentId });
    });
    this.todosForm.get('search')?.valueChanges.subscribe((res) => {
      const statusId = this.todosForm.value.status;
      const agentId = this.todosForm.value?.agent;
      const creatorId = this.todosForm.value?.created_by;
      this.searchModel = { ...this.searchModel, pageIndex: 1, search: res, client_id: agentId, status: statusId, created_by: creatorId};
      if (res.length >= 3 || res === '') {
        this.todoFacade.loadTodoList({ search: res, status: statusId, client_id: agentId, created_by: creatorId });
      }
    });
    this.todoFacade.getTodoList$.subscribe((todos: any) => {
      if (!todos.data) {
        this.hasFilter = false;
      }
      else {
        this.hasFilter = true;
      }
      this.totalRecords = todos?.meta?.pagination?.total;
      this.currentPage = todos.meta?.pagination?.current_page;
      this.pagesize = todos.meta?.pagination.per_page;
      this.todoList = this.sortOption(
        todos.data
          ? todos.data.map((a: any) => {
            return {
              value: a.id,
              name: a.owner?.data?.fullname,
              content: a?.subject,
              target: a?.target_at,
              created: a?.created_at,
              status: a?.state,
              creator: a?.creator?.data?.name,
              creator_role: a?.creator?.data?.role,
              owner_id: a?.owner?.data?.agent?.data?.id,
              creator_all: a?.creator,
              owner: a?.owner,
              important: a?.important,
              isCreator: userRole === 'admin' || (!a.id) || (a.creator && a.creator.data.id === userId)
            };
          })
          : []
      );
    });
    this.loading$ = this.todoFacade.getLoadingStatus$;
    this.loadLookUps();
  }

  loadLookUps() {
    this.translateService
      .get('todos.details.fields.state')
      .subscribe((a) => {
        this.stateLK = FormConfig.todos.state.map((a) => {
          return {
            value: a,
            text: this.translateService.instant(
              'todos.details.fields.state.' + a
            ),
          };
        });
      });
  }

  sortOption(options: OptionVM[]) {
    return options.sort((a: OptionVM, b: OptionVM) =>
      a.text && b.text ? (a.text > b.text ? 1 : b.text > a.text ? -1 : 0) : 0
    );
  }

  pageChange(event: any) {
    const update: any = {
      ...this.searchModel,
      pageSize: event.pageSize,
      pageIndex: event.pageIndex + 1,
    };
    this.todoFacade.loadTodoList(update);
  }

  openModal(lists: any) {
    const abc = new Date(lists.target);
    const year = abc.getFullYear();
    const month = abc.getMonth() + 1;
    const date = abc.getDate();
    const finalDate = date + '-' + month + '-' + year;
    const dialogRef = this.dialog.open(TodosModalComponent, {
      data: {
        isEdit: true,
        value: lists,
        agent: this.agentList,
        targetDate: finalDate
      }
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        const result = value?.modelValue;
        const newObject = {
          createdAt: lists?.created,
          created_at: lists?.created,
          creatorName: lists?.creator,
          important: result?.important,
          isDone: false,
          creator: lists?.creator_all,
          owner: lists?.owner,
          isOverdued: true,
          ownerFullname: value?.selectedAgent,
          owner_id: lists?.owner?.data?.id,
          state: lists?.status,
          subject: result?.content,
          targetAt: lists?.target,
          target_at: lists?.target,
          updated_at: lists?.target,
          todosId: lists?.value
        };
        this.todoFacade.updateModal(newObject);
      }
    });
  }

  confirmModal(lists: any){
    const dialogRef = this.dialog.open(ReasonBoxComponent,{
      data: {
        type: 'warning',
        title: this.translateService.instant(
          'todos.set-state.title'
        ),
        message: this.translateService.instant(
          'todos.set-state.message'
        ),
        cancelCode: 'todos.set-state.buttons.cancel' ,
        confirmCode: 'todos.set-state.buttons.confirm',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const newObject = {
          createdAt: lists?.created,
          created_at: lists?.created,
          creatorName: lists?.creator,
          important: lists?.important,
          isDone: true,
          creator: lists?.creator_all,
          owner: lists?.owner,
          isOverdued: false,
          ownerFullname: '',
          owner_id: lists?.owner?.data?.id,
          state: 'done',
          subject: lists?.content,
          targetAt: lists?.target,
          target_at: lists?.target,
          updated_at: lists?.target,
          todosId: lists?.value
        };
        const update: any = {
          ...this.searchModel,
        };
        this.todoFacade.updateModal(newObject);
        setTimeout(() => {
          this.todoFacade.loadTodoList(update);
        }, 400);
      }
    });
  }

 addModal() {
    this.dialog.open(TodosModalComponent, {
      data: {
        isEdit: false,
        agent: this.agentList
      }
    }).afterClosed().subscribe((res) => {
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
      }
    });
  }

  getDateDifference(completedDate: any) {
    const CurrentDate = new Date();
    const GivenDate = new Date(completedDate);
    return GivenDate < CurrentDate;
  }

  getDate(completedDate: any) {
    const CurrentDate = new Date();
    const GivenDate = new Date(completedDate);
    return GivenDate >= CurrentDate;
  }
}
