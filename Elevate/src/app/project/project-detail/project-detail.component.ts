import * as fromProject from './../state';
import * as fromProjectAction from './../state/project.actions';
import * as fromUser from './../../root-state/user-state';
import * as moment from 'moment';

import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  ProjectDocumentVM,
  ProjectFeedbackQuestionVM,
  ProjectSummaryVM,
  ProjectVM,
} from './../../model/project.model';
import { Store, select } from '@ngrx/store';
import { take, takeWhile } from 'rxjs/operators';

import { AllowedActions } from '../../constant/allowed-actions.constant';
import { ContractTypesService } from '../../services/contract-types.service';
import { OptionVM } from '../../model/option.model';
import { SalesSlotVM } from '../../model/client.model';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss'],
})
export class ProjectDetailComponent implements OnInit {
  id = '';
  componentActive = true;
  projectDetail$: Observable<ProjectVM | undefined> = of(undefined);
  projectSummary$: Observable<ProjectSummaryVM | undefined> = of(undefined);
  briefingDocument$: Observable<ProjectDocumentVM[]> = of([]);
  templateDocument$: Observable<ProjectDocumentVM[]> = of([]);
  projectSalesSlots$: Observable<SalesSlotVM[]> = of([]);
  projectFeedbackQuestion$: Observable<ProjectFeedbackQuestionVM[]> = of([]);
  projectFreelancerRating$: Observable<string[]> = of([]);
  manageClientPermission$: Observable<boolean> = of(false);
  manageOrderPermission$: Observable<boolean> = of(false);
  contractTypeLK: OptionVM[] = [];
  projectName$: Observable<string | undefined> = of(undefined);
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private contractTypesService: ContractTypesService,
    private store: Store<fromProject.State>,
    private userStore: Store<fromUser.State>
  ) {}

  ngOnInit(): void {
    this.loadLookUps();
    this.store.dispatch(new fromProjectAction.ClearProject());
    this.manageClientPermission$ = this.userStore.pipe(
      select(fromUser.isAllowed, {
        permissions: AllowedActions['manage-clients'],
      }),
      takeWhile(() => this.componentActive)
    );
    this.manageOrderPermission$ = this.userStore.pipe(
      select(fromUser.isAllowed, {
        permissions: AllowedActions['manage-orders'],
      }),
      takeWhile(() => this.componentActive)
    );
    this.retrieveIdFromParameters();
    this.projectDetail$ = this.store.pipe(
      select(fromProject.getProjectDetail),
      takeWhile(() => this.componentActive)
    );
    this.projectName$ = this.store.pipe(
      select(fromProject.getProjectName),
      takeWhile(() => this.componentActive)
    );
    this.projectSummary$ = this.store.pipe(
      select(fromProject.getProjectSummary),
      takeWhile(() => this.componentActive)
    );
    this.projectSalesSlots$ = this.store.pipe(
      select(fromProject.getProjectSalesSlots),
      takeWhile(() => this.componentActive)
    );
    this.projectFreelancerRating$ = this.store.pipe(
      select(fromProject.getProjectFreelancerRating),
      takeWhile(() => this.componentActive)
    );
    this.projectFeedbackQuestion$ = this.store.pipe(
      select(fromProject.getProjectFeedbackQuestion),
      takeWhile(() => this.componentActive)
    );

    this.templateDocument$ = this.store.pipe(
      select(fromProject.getProjectDocument, { type: 'template-report' }),
      takeWhile(() => this.componentActive)
    );
    this.briefingDocument$ = this.store.pipe(
      select(fromProject.getProjectDocument, { type: 'briefing' }),
      takeWhile(() => this.componentActive)
    );
  }
  loadLookUps() {
    this.contractTypesService
      .getContractTypes({})
      .pipe(takeWhile(() => this.componentActive))
      .subscribe((res) => {
        this.contractTypeLK = this.sortOption(
          res.data
            ? res.data.map((a) => ({
                  value: a.id,
                  text: a.name,
                }))
            : []
        );
      });
  }
  retrieveIdFromParameters() {
    this.route.paramMap.pipe(take(1)).subscribe((params) => {
      this.loadDetail(params);
    });
  }
  loadDetail(params: ParamMap) {
    if (params && params.get('id')) {
      this.id = params.get('id') || '';
      if (this.id) {
        this.store.dispatch(
          new fromProjectAction.LoadProjectDetail({ id: this.id, mode: 'view' })
        );
      }
    }
  }
  sortOption(options: OptionVM[]) {
    return options.sort((a: OptionVM, b: OptionVM) =>
      a.text && b.text ? (a.text > b.text ? 1 : b.text > a.text ? -1 : 0) : 0
    );
  }

  navigateToCreateJobs() {
    this.router.navigateByUrl(`projects/${this.id}/jobs`);
  }

  checkFinish(project: any) {
    return moment(project.finished_at).diff(moment(), 'days') > 0;
  }
}
