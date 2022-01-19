import { FormArray, FormBuilder, FormControl, Validators, FormGroup, NgForm, ControlContainer, NgModelGroup } from '@angular/forms';
import { Component, Input, OnInit, ViewChild, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TaskInfoVM } from '../../model/client.model';


@Component({
  selector: 'app-taskinfo',
  templateUrl: './taskinfo.component.html',
  styleUrls: ['./taskinfo.component.scss']

})
export class TaskInfoComponent implements AfterViewInit, OnChanges {
  @Input()
  mode: string = 'view';
  @Input()
  parentGroup: FormGroup | undefined;
  @Input()
  maininfo: FormArray | undefined;
  @Input()
  displayMessage: any[] = [];
  @Input()
  info: TaskInfoVM[] | undefined | null;

  displayedColumns = ['role', 'task_name', 'remarks'];
  dataSource = new MatTableDataSource<TaskInfoVM>([]);
  @ViewChild(MatPaginator)
  paginator?: MatPaginator;

  constructor(private fb: FormBuilder) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.info) {
      if (this.info?.length && this.info[0]) {
        this.dataSource = new MatTableDataSource<TaskInfoVM>(this.info);
      } else {
        this.dataSource = new MatTableDataSource<TaskInfoVM>([]);
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
    if (this.maininfo) {
      this.maininfo.push(this.getNew());
    }
  }
  getNew() {
    return this.fb.group({
      task_name: new FormControl('', [Validators.required]),
      role: new FormControl('', [Validators.required]),
      shift: new FormControl('', []),
      type: new FormControl('', []),
      remarks: new FormControl('', []),
      files: new FormControl('', []),
    });
  }
  remove(index: number) {
    if (this.maininfo) {
      this.maininfo.removeAt(index);
    }
  }
}
