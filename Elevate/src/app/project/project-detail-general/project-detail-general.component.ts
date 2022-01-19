import { OptionVM } from './../../model/option.model';
import { ProjectDocumentVM, ProjectVM } from './../../model/project.model';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-project-detail-general',
  templateUrl: './project-detail-general.component.html',
  styleUrls: ['./project-detail-general.component.scss']
})
export class ProjectDetailGeneralComponent implements OnInit {
  @Input()
  project: ProjectVM | undefined | null;
  @Input()
  templateDocuments: ProjectDocumentVM[] | null = [];
  @Input()
  allowManageCustomer: boolean | null = false;
  @Input()
  allowManageOrder: boolean | null = false;

  @Input()
  contractTypeLK: OptionVM[] | null = [];

  constructor() {
  }

  ngOnInit(): void {
  }

}
