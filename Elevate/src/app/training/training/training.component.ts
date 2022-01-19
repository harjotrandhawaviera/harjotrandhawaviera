import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss']
})
export class TrainingComponent implements OnInit {
  @Input()
  training: any;
  constructor() { }

  ngOnInit(): void {
  }

}
