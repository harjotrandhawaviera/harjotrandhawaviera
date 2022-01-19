import { FormArray, FormBuilder, FormControl, Validators, FormGroup, NgForm, ControlContainer, NgModelGroup } from '@angular/forms';
import { Component, Input, OnInit, ViewChild, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TargetBudgetVM } from '../../model/project.model';

@Component({
  selector: 'app-target-budget',
  templateUrl: './target-budget.component.html',
  styleUrls: ['./target-budget.component.scss']

})
export class TargetBudgetComponent implements AfterViewInit, OnChanges {
  @Input()
  mode: string = 'view';
  @Input()
  parentGroup: FormGroup | undefined;
  @Input()
  additional_costs: FormArray | undefined;
  @Input()
  displayMessage: any[] = [];
  @Input()
  targetBudget: TargetBudgetVM[] | undefined | null;
  @Input()
  currency: any;

  displayedColumns = ['role', 'total', 'per_shift', 'per_hour'];
  dataSource = new MatTableDataSource<TargetBudgetVM>([]);
  @ViewChild(MatPaginator)
  paginator?: MatPaginator;

  constructor(private fb: FormBuilder) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.targetBudget) {
      if (this.targetBudget) {
        this.dataSource = new MatTableDataSource<TargetBudgetVM>(this.targetBudget);
      } else {
        this.dataSource = new MatTableDataSource<TargetBudgetVM>([]);
      }
      this.assignPaginator();
    }
  }

  ngAfterViewInit() {
    this.assignPaginator();
  }

  private assignPaginator() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }
  add() {
    if (this.additional_costs) {
      this.additional_costs.push(this.getNew());
    }
  }
  getNew() {
    return this.fb.group({
      name: new FormControl('', [Validators.required]),
      value: new FormControl('', [Validators.required]),
      description: new FormControl('', [])
    });
  }
  remove(index: number) {
    if (this.additional_costs) {
      this.additional_costs.removeAt(index);
    }
  }
}
