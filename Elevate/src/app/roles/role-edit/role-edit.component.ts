import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { of } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RoleService } from '../../services/role.service';
import { take } from 'rxjs/operators';
import { SkillService } from '../../services/skill.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '../../services/translate.service';
import { GenericValidatorService } from '../../services/generic-validator.service';

@Component({
  selector: 'app-role-edit',
  templateUrl: './role-edit.component.html',
  styleUrls: ['./role-edit.component.scss'],
})
export class RoleEditComponent implements OnInit {
  role = new FormGroup({
    label: new FormControl('', Validators.required),
    identifier: new FormControl('', Validators.required),
    region: new FormControl('', Validators.required),
    skills: new FormControl(''),
    roles: new FormControl(''),
    description: new FormControl('', Validators.required)
  });
  id: any;
  Nid: any;
  paramId: any;
  result: any = of([]);
  mode: any;
  regionsLK: any[] = [];
  skillsLK: any[] = [];
  validationMessages: any;
  displayMessage: any = {};

  constructor(private roleService: RoleService,
    private translateService: TranslateService,
    private genericValidatorService: GenericValidatorService,
    private toastrService: ToastrService,
    private skillService: SkillService,
    private router: Router,public dialog: MatDialog, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.lookupLK();
    this.retrieveIdFromParameters();
    this.translateService.get('form.errors.required').subscribe(() => {
      this.validationMessages = {
        region: {
          required: this.translateService.instant('form.errors.required'),
        },
        identifier: {
          required: this.translateService.instant('form.errors.required'),
        },
        label: {
          required: this.translateService.instant('form.errors.required'),
        },
        description: {
          required: this.translateService.instant('form.errors.required'),
        }
      }
    })

    if (this.role) {
      this.role.valueChanges.subscribe((value) => {
        if (this.role) {
          this.displayMessage = this.genericValidatorService.processMessages(
            this.role,
            this.validationMessages
          );
        }
      });
    }
  }

  retrieveIdFromParameters() {
    this.route.data.pipe(take(1)).subscribe((res) => {
      this.mode = res.mode;
      if (res.mode === 'edit') {
        this.route.paramMap.pipe(take(1)).subscribe((params) => {
          this.loadDetail(params);
        });
      }
    });
  }

  loadDetail(params: ParamMap) {
    if (params && params.get('id')) {
      if (this.mode === 'edit') {
        this.id = params.get('id');
        if (this.id) {
          this.paramId = this.id;
          this.roleService.getRoleDetail(this.id).subscribe((roleData) => {
            this.role.patchValue({
              identifier: roleData.identifier,
              label: roleData.label,
              description: roleData.description,
              region: roleData.regions && roleData.regions.length && roleData.regions.map((r: { id: any }) => r.id),
              skills: roleData.skills && roleData.skills.length && roleData.skills.map((r: { id: any }) => r.id)
            });
          });
        }
      }
    }
  }
  lookupLK() {
    this.getRegions();
    this.getSkills()
  }

  getSkills() {
    this.skillService.getSkills({}).subscribe((res) => {
      let newReg = [];
      if (res.data && res.data.length) {
        newReg = res.data.map((reg: { id: any; title: any }) => {
          return {
            value: reg.id,
            text: reg.title,
          };
        });
      }
      this.skillsLK = newReg;
    });
  }

  getRegions() {
    this.roleService.getRegions().subscribe((res) => {
      let newReg = [];
      if (res.data && res.data.length) {
        newReg = res.data.map((reg: { id: any; name: any }) => {
          return {
            value: reg.id,
            text: reg.name,
          };
        });
      }
      this.regionsLK = newReg;
    });
  }

  add() {
    if(this.role.valid) {
      if (this.paramId) {
        this.roleService
          .updateRole(this.role.value, this.paramId)
          .subscribe((data) => {
            this.toastrService.success(this.translateService.instant('notification.post.roles.edit-success'));
            this.router.navigate(['master/roles']);
          });
      } else {
        this.roleService.addRole(this.role.value).subscribe((data) => {
          this.toastrService.success(this.translateService.instant('notification.post.roles.add-success'));
          this.router.navigate(['master/roles']);
        });
      }
    }
  }
  navigateToDetail() {}
}
