import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-todos-modal',
  templateUrl: './todos-modal.component.html',
  styleUrls: ['./todos-modal.component.scss']
})
export class TodosModalComponent implements OnInit {
  selectDate = new Date();
  selected = 0;
  owner_name = '';
  todosModal = new FormGroup({
    content: new FormControl(),
    agent: new FormControl(),
    completeBy: new FormControl(new Date()),
    important: new FormControl()
  });
  constructor(public dialogRef: MatDialogRef<TodosModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.selectDate.setDate(this.selectDate.getDate() + 1);
  }

  ngOnInit(): void {
    this.data?.agent?.map((res: any) => {
      if (this.data.value?.owner_id === res.value) {
        this.selected = res.value;
        this.owner_name = res.text;
      }
    });
    this.todosModal.patchValue({
      content: this.data?.value?.content,
      important: this.data?.value?.important,
      agent: this?.selected,
      completeBy: this.data?.targetDate
    });
  }
}
