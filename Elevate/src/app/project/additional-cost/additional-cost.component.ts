import { FormArray, FormBuilder, FormControl, Validators, FormGroup, NgForm, ControlContainer, NgModelGroup } from '@angular/forms';
import { Component, Input, OnInit, ViewChild, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AdditionalCostVM } from '../../model/project.model';

@Component({
  selector: 'app-additional-cost',
  templateUrl: './additional-cost.component.html',
  styleUrls: ['./additional-cost.component.scss']

})
export class AdditionalCostComponent implements AfterViewInit, OnChanges {
  @Input()
  mode: string = 'view';
  @Input()
  parentGroup: FormGroup | undefined;
  @Input()
  additional_costs: FormArray | undefined;
  @Input()
  displayMessage: any[] = [];
  @Input()
  additionalCosts: AdditionalCostVM[] | undefined | null;

  displayedColumns = ['name', 'value', 'description'];
  dataSource = new MatTableDataSource<AdditionalCostVM>([]);
  @ViewChild(MatPaginator)
  paginator?: MatPaginator;

  constructor(private fb: FormBuilder) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.additionalCosts) {
      if (this.additionalCosts) {
        this.dataSource = new MatTableDataSource<AdditionalCostVM>(this.additionalCosts);
      } else {
        this.dataSource = new MatTableDataSource<AdditionalCostVM>([]);
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
