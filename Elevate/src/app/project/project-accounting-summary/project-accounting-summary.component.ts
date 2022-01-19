import { ProjectVM } from './../../model/project.model';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-project-accounting-summary',
  templateUrl: './project-accounting-summary.component.html',
  styleUrls: ['./project-accounting-summary.component.scss']
})
export class ProjectAccountingSummaryComponent implements OnInit {

  @Input()
  project: ProjectVM | undefined | null =  undefined;
  constructor() { }

  ngOnInit(): void {
  }

}
