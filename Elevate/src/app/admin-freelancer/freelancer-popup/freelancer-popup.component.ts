import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-freelancer-popup',
  templateUrl: './freelancer-popup.component.html',
  styleUrls: ['./freelancer-popup.component.scss']
})
export class FreelancerPopupComponent implements OnInit {
  id: any;
  constructor(public dialogRef: MatDialogRef<FreelancerPopupComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.id = this.data.id;
  }

}
