import { ProjectSummaryVM } from './../../model/project.model';
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import * as fromUser from './../../root-state/user-state';
import { select, Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
type summary = {
  idKey?: string,
  count?: number,
  child: {
    idKey?: string,
    count?: number
  }[]
};
@Component({
  selector: 'app-project-detail-summary',
  templateUrl: './project-detail-summary.component.html',
  styleUrls: ['./project-detail-summary.component.scss']
})
export class ProjectDetailSummaryComponent implements OnChanges {

  @Input()
  projectSummary: any = undefined;
  localSummary: summary[] = [];
  constructor(
    private userStore: Store<fromUser.State>,
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.projectSummary) {
      if (this.projectSummary) {
        this.userStore.pipe(
          select(fromUser.getUserRole),
          take(1)
        ).subscribe(res => {
          if (res) {
            this.localSummary = [];
            for (const key in this.projectSummary) {
              if (Object.prototype.hasOwnProperty.call(this.projectSummary, key)) {
                const obj: summary = { idKey: key, count: this.projectSummary[key].count, child: [] }
                if (this.projectSummary[key].states) {
                  const states = this.projectSummary[key].states;
                  for (const childKey in states) {
                    if (Object.prototype.hasOwnProperty.call(states, childKey)) {
                      obj.child.push({ idKey: childKey, count: states[childKey] })
                    }
                  }
                }
                this.localSummary.push(obj);
              }
            }
          }
          // vm.data.assignments.states.done = vm.data.assignments.states.preparation + vm.data.assignments.states.invoiced;
          //       delete vm.data.assignments.states.preparation;
          //       delete vm.data.assignments.states.invoiced
        });
      }
    }
  }

  ngOnInit(): void {

  }

}
