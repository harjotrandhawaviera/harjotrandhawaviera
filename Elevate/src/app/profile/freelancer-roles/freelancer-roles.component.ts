import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { E } from '@angular/cdk/keycodes';
import { FreelancerService } from '../../services/freelancer.service';

@Component({
  selector: '[app-freelancer-roles]',
  templateUrl: './freelancer-roles.component.html',
  styleUrls: ['./freelancer-roles.component.scss']
})
export class FreelancerRolesComponent implements OnInit, OnChanges, AfterViewInit {
  // roles: any[] = ["Full-Stack Developer", "Front-end Developer", "Angular Developer"];
  @Input()
  inFormGroup: any;
  @Input()
  roles: any;
  @Input()
  readonly = false;
  @Input()
  isPrimaryRole = false;
  @Input()
  index: any;
  public isRolePrimary:boolean=false;
  @Output() roleAdded = new EventEmitter();
  @Output() roleRemoved = new EventEmitter();
  selectedRole: any;
  role: any;
  constructor(private freelancerService: FreelancerService) { }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.roles.length==0){
      this.freelancerService.getRoles().subscribe((res) => {
        this.roles = res.data;
        this.roles.forEach((res:any) => {
          if(res.label == this.inFormGroup.value.role_label){
            this.role = res;
          }
        })
      })
    }
    this.roles.forEach((res:any) => {
      if(res.label == this.inFormGroup.value.role_label){
        this.role = res;
      }
    })
  }
  ngAfterViewInit(): void {
    if(this.index==0){
      this.isRolePrimary=true;
    }else{
      this.isRolePrimary=false
    }
   
  }

  ngOnInit(): void {
  }
  onRoleSelect(data: any){
    this.selectedRole = data;
    this.inFormGroup.controls.role_label.setValue(data.label);
    this.inFormGroup.controls.role_description.setValue(data.description);
    this.inFormGroup.controls.role_id.setValue(data.id);
  }
  addNewRole() {
    this.roleAdded.emit(true)
  }
  removeRole($event: any) {
    this.roleRemoved.emit(true)
  }

}
