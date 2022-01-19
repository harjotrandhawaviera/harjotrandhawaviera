import * as fromSkill from './../state';
import * as fromSkillAction from './../state/skills.actions';
import * as fromUser from './../../root-state/user-state';

import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ProjectSearchVM, ProjectVM } from '../../model/project.model';
import { Store, select } from '@ngrx/store';
import { takeWhile } from 'rxjs/operators';

import { AgentService } from './../../services/agent.service';
import { AllowedActions } from '../../constant/allowed-actions.constant';
import { ClientMappingService } from './../../services/mapping-services/client-mapping.service';
import { ClientService } from './../../services/client.service';
import { MatDialog } from '@angular/material/dialog';
import { OptionVM } from './../../model/option.model';
import { Router } from '@angular/router';
import { StorageService } from './../../services/storage.service';
import { SkillSearchVM, SkillVM } from '../../model/skill.model';
import { SkillService } from '../../services/skill.service';
import { ReasonBoxComponent } from '../../core/reason-box/reason-box.component';
import { TranslateService } from '../../services/translate.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-skill-list',
  templateUrl: './skill-list.component.html',
  styleUrls: ['./skill-list.component.scss'],
})
export class SkillListComponent implements OnInit {
  searchForm = new FormGroup({
    category: new FormControl(''),
    region: new FormControl(''),
    dateFrom: new FormControl(''),
    dateTo: new FormControl(''),
    search: new FormControl(''),
  });
  displayedColumns = ['category', 'name', 'region', 'createdDate', 'action'];
  result$: Observable<ProjectVM[]> = of([]);
  searchModel$: Observable<ProjectSearchVM | undefined> = of({});
  componentActive = true;
  searchModel: ProjectSearchVM = {};
  totalRecords$: Observable<number | undefined> = of(undefined);
  currentPage$: Observable<number | undefined> = of(undefined);
  pageSize$: Observable<number | undefined> = of(undefined);
  loading$: Observable<boolean> = of(false);
  noRecords$: Observable<boolean> = of(false);
  deletePermission$: Observable<boolean> = of(false);

  @HostListener('window:beforeunload', ['$event'])
  clearLocalStorage() {
    localStorage.removeItem('project.search');
  }

  constructor(
    private skillService: SkillService,
    private storageService: StorageService,
    private userStore: Store<fromUser.State>,
    public dialog: MatDialog,
    private router: Router,
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private store: Store<fromSkill.State>
  ) {}

  ngOnInit(): void {
    const previous = this.storageService.get('skill.search');
    if (previous !== null) {
      const { skillCategory, title, search, region, createdDate } = JSON.parse(
        previous
      ) as SkillSearchVM;
      this.searchForm.patchValue({
        category: skillCategory,
        name: title,
        search: search,
        region: region,
        dateFrom: createdDate,
      });
    } else {
      const searchModel: SkillSearchVM = {
        pageIndex: 1,
        pageSize: 6,
      };
      this.store.dispatch(new fromSkillAction.UpdateSearch(searchModel));
    }
    this.loadLookUps();
    this.loading$ = this.store.pipe(
      select(fromSkill.getLoading),
      takeWhile(() => this.componentActive)
    );
    this.deletePermission$ = this.userStore.pipe(
      select(fromUser.isAllowed, {
        permissions: AllowedActions['delete-skill'],
      }),
      takeWhile(() => this.componentActive)
    );
    this.result$ = this.store.pipe(
      select(fromSkill.getSearchResult),
      takeWhile(() => this.componentActive)
    );
    this.noRecords$ = this.store.pipe(
      select(fromSkill.getNoRecords),
      takeWhile(() => this.componentActive)
    );

    this.currentPage$ = this.store.pipe(
      select(fromSkill.getCurrentIndex),
      takeWhile(() => this.componentActive)
    );
    this.totalRecords$ = this.store.pipe(
      select(fromSkill.getTotalRecord),
      takeWhile(() => this.componentActive)
    );
    this.pageSize$ = this.store.pipe(
      select(fromSkill.getPageSize),
      takeWhile(() => this.componentActive)
    );
    this.searchModel$ = this.store.pipe(
      select(fromSkill.getSearchModel),
      takeWhile(() => this.componentActive)
    );
    this.searchModel$.subscribe((res) => {
      if (res) {
        this.searchModel = res;
        this.store.dispatch(
          new fromSkillAction.LoadSkillList(this.searchModel)
        );
      } else {
        const searchModel: SkillSearchVM = {
          pageIndex: 1,
          pageSize: 6,
        };
        this.store.dispatch(new fromSkillAction.UpdateSearch(searchModel));
      }
    });

    this.searchForm.get('category')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, category: res };
      this.store.dispatch(new fromSkillAction.UpdateSearch(update));
    });

    this.searchForm.get('region')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, region: res };
      this.store.dispatch(new fromSkillAction.UpdateSearch(update));
    });

    this.searchForm.get('dateFrom')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, dateFrom: res };
      this.store.dispatch(new fromSkillAction.UpdateSearch(update));
    });

    this.searchForm.get('dateTo')?.valueChanges.subscribe((res) => {
      const update = { ...this.searchModel, pageIndex: 1, dateTo: res };
      this.store.dispatch(new fromSkillAction.UpdateSearch(update));
    });

    this.searchForm.get('search')?.valueChanges.subscribe((res) => {
      if ((res && res.length > 2) || !res) {
        const update = { ...this.searchModel, pageIndex: 1, search: res };
        this.store.dispatch(new fromSkillAction.UpdateSearch(update));
      }
    });
  }
  categoriesLK: any[] = [];
  regionsLK: any[] = [];

  loadLookUps() {
    // once the api for the category list and region list will be provided will call those api then to get the list
    this.skillService.getCategories().subscribe((res) => {
      let newCat = [];
      if (res.data && res.data.length) {
        newCat = res.data.map((reg: { id: any; name: any }) => {
          return {
            value: reg.id,
            text: reg.name,
          };
        });
      }
      this.categoriesLK = newCat;
    });

    this.skillService.getRegions().subscribe((res) => {
      let newReg = [];
      if (res.data && res.data.length) {
        newReg = res.data.map((reg: { id: any; name: any }) => {
          return {
            value: reg.id,
            text: reg.name,
          };
        });
      }
      this.regionsLK = newReg;
    });
  }

  showValOfList(list: any[]) {
    let listwithname = [];
    if (list && list.length) {
      listwithname = list.map((l) => l.name);
    }
    if (listwithname && listwithname.length) {
      return listwithname.toString();
    } else {
      return '-';
    }
  }

  open(row: any) {
    this.dialog
      .open(ReasonBoxComponent, {
        data: {
          type: 'warning',
          title: this.translateService.instant(
            'master.skills.table.remove.title'
          ),
          message: this.translateService.instant(
            'master.skills.table.remove.message'
          ),
          cancelCode: 'administration.client.buttons.cancel',
          confirmCode: 'todos.set-state.buttons.confirm',
        },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          const id = row;
          this.skillService.removeSkill(id).subscribe((_) => {
            this.toastrService.success(
              this.translateService.instant('notification.delete.skill.success')
            );
            this.store.dispatch(
              new fromSkillAction.LoadSkillList(this.searchModel)
            );
          });
          // this.administrationFacade.deleteDeployInvoice(id);
        }
      });
  }

  ngOnDestroy(): void {
    this.componentActive = false;
  }

  navigateToDetail(data: SkillVM) {
    this.router.navigate(['/master/skills', data.id, 'detail']);
  }

  pageChange(event: any) {
    const update = {
      ...this.searchModel,
      pageSize: event.pageSize,
      pageIndex: event.pageIndex + 1,
    };
    this.store.dispatch(new fromSkillAction.UpdateSearch(update));
  }

  searchChange() {
    const formValues = this.searchForm.getRawValue();
    const update = {
      ...this.searchModel,
      pageIndex: 1,
      parent: formValues.parent,
      search: formValues.search,
    };
    this.store.dispatch(new fromSkillAction.UpdateSearch(update));
  }
}
