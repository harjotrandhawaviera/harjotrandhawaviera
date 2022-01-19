import { FormArray, FormBuilder, FormControl, Validators, FormGroup, NgForm, ControlContainer, NgModelGroup } from '@angular/forms';
import { Component, Input, OnInit, ViewChild, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TeamInfoVM } from '../../model/client.model';


@Component({
  selector: 'app-teaminfo',
  templateUrl: './teaminfo.component.html',
  styleUrls: ['./teaminfo.component.scss']

})
export class TeamInfoComponent implements AfterViewInit, OnChanges {
  @Input()
  mode: string = 'view';
  @Input()
  parentGroup: FormGroup | undefined;
  @Input()
  maininfo: FormArray | undefined;
  @Input()
  displayMessage: any[] = [];
  @Input()
  info: TeamInfoVM[] | undefined | null;

  displayedColumns = ['name', 'checkin_location', 'role', 'staff_count', 'rate_type', 'rate', 'shift_name', 'shift_start_time', 'shift_end_time', 'break_durtion'];
  dataSource = new MatTableDataSource<TeamInfoVM>([]);
  @ViewChild(MatPaginator)
  paginator?: MatPaginator;

  constructor(private fb: FormBuilder) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.info) {
      if (this.info?.length && this.info[0]) {
        this.dataSource = new MatTableDataSource<TeamInfoVM>(this.info);
      } else {
        this.dataSource = new MatTableDataSource<TeamInfoVM>([]);
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
      name: new FormControl('', [Validators.required]),
      checkin_location: new FormControl('', [Validators.required]),
      role: new FormControl('', []),
      staff_count: new FormControl('', []),
      rate: new FormControl('', []),
      rate_type: new FormControl('', []),
      shift_name: new FormControl('', []),
      shift_start_time: new FormControl('', []),
      shift_end_time: new FormControl('', []),
      break_durtion: new FormControl('', [])
    });
  }
  remove(index: number) {
    if (this.maininfo) {
      this.maininfo.removeAt(index);
    }
  }
}
