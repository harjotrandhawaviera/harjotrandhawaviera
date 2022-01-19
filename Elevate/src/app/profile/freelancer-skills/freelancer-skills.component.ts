import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';

import { FileExportService } from '../../services/file-export.service';
import { FreelancerService } from '../../services/freelancer.service';
import {PreviewDownloadPopupComponent} from '../../admin-freelancer/preview-download-popup/preview-download-popup.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: '[app-freelancer-skills]',
  templateUrl: './freelancer-skills.component.html',
  styleUrls: ['./freelancer-skills.component.scss']
})
export class FreelancerSkillsComponent implements OnInit {
  // skills:any[]=["Full-Stack Developer","Front-end Developer","Angular Developer"];
  @Input()
  inFormGroup: any;
  @Input()
  skills: any;
  @Input()
  readonly = false;
  @Output() skillAdded = new EventEmitter();
  @Output() skillRemoved = new EventEmitter();
  onDocumentClick: boolean = false;
  selectedSkill: any;
  selectedSkillCategory: any;
  constructor(
    private fileExportService: FileExportService,
    private freelancerService: FreelancerService,
    private dialog: MatDialog) { }
  get document(): FormControl | undefined {
    return this.inFormGroup
      ? (this.inFormGroup.get('document') as FormControl)
      : undefined;
  }
  ngOnInit(): void {
    this.selectedSkill = this.inFormGroup.value;
    if(this.skills.length>0){
    this.skills.forEach((val:any) => {
      val.value.forEach((res:any) => {
        if(res.skillCategory.id == this.selectedSkill.skill_category_id && this.selectedSkill.skillcategory == null){
       this.selectedSkillCategory = val.value;
        this.selectedSkill.skillcategory = res.skillCategory.name
        this.inFormGroup.controls.skillcategory.setValue(res.skillCategory.name)
        }
      })
    })
  }
  else{
    this.skills = [];
    this.freelancerService.getSkills().subscribe((res) => {
      let users =   res.data.reduce(function (r: any, a: any) {
        r[a.skillCategory.name] = r[a.skillCategory.name] || [];
        r[a.skillCategory.name].push(a);
        return r;
    }, Object.create(null));
    Object.keys(users).forEach(key => { this.skills.push({ name: key, value: users[key]})
    this.skills.forEach((val:any) => {
      val.value.forEach((res:any) => {
        if(res.skillCategory.id == this.selectedSkill.skill_category_id && this.selectedSkill.skillcategory == null){
       this.selectedSkillCategory = val.value;
        this.selectedSkill.skillcategory = res.skillCategory.name
        this.inFormGroup.controls.skillcategory.setValue(res.skillCategory.name)
        }
      })
    })
});
    })
  }
  }

  addNewSkill(){
    this.skillAdded.emit(true)
  }
  onSkillCategorySelect(data: any){
    this.selectedSkillCategory = data.value;
  }
  onSkillSelect(data: any){
    this.selectedSkill = data;
    if(data.required_proof == 0){
      this.inFormGroup.controls.document_id.reset()
      this.inFormGroup.controls.document.reset()
    }
    this.inFormGroup.controls.skillName.setValue(data.title);
    this.inFormGroup.controls.skill_id.setValue(data.id);
  }
  removeSkill($event:any){
    this.skillRemoved.emit(true)
  }
  onDocumentUpload(evt: any){
    this.inFormGroup.controls.document_id.setValue(evt.id);
    this.inFormGroup.controls.document.setValue(evt);
  }

  downloadDocument(doc: any) {
    if (doc?.mime.includes('pdf')) {
      this.dialog.open(PreviewDownloadPopupComponent, {
        data: {
          pdf: doc
        },
        disableClose: true
      });
    }
    else if (doc?.mime.includes('image')) {
      this.dialog.open(PreviewDownloadPopupComponent, {
        data: {
          image: doc
        },
        disableClose: true
      });
    }
    else {
      this.dialog.open(PreviewDownloadPopupComponent, {
        data: {
          pdf: doc
        },
        disableClose: true
      });
    }

  }
  removeDocument(doc: any) {
    if (this.document) {
      this.inFormGroup.removeControl('document')
      // this.document.reset();
     }
  }
}
