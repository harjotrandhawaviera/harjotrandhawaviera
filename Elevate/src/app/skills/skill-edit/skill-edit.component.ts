import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { CategoryAddDialogComponent } from '../category-add/category-add.component';
import { MatDialog } from '@angular/material/dialog';
import { SkillService } from '../../services/skill.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '../../services/translate.service';
import { of } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-skill-edit',
  templateUrl: './skill-edit.component.html',
  styleUrls: ['./skill-edit.component.scss'],
})
export class SkillEditComponent implements OnInit, AfterViewInit {
  skill = new FormGroup({
    category: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    region: new FormControl('', Validators.required),
    requiredProof: new FormControl(0),
  });
  id: any;
  paramId: any;
  result: any = of([]);
  categoryLK: any[] = [];
  regionsLK: any[] = [];
  mode: any;
  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private skillService: SkillService,
    private router: Router,
    private toastrService: ToastrService,
    private translateService: TranslateService
  ) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(CategoryAddDialogComponent);

    dialogRef.afterClosed().subscribe((res) => {
      if (res)
        this.skillService.addCategory(res).subscribe((catData: any) => {
          this.categoryLK.push({ value: catData.id, text: catData.name });
          this.skill.get('category')?.patchValue(catData.id);
        });
    });
  }

  ngOnInit(): void {
    this.lookupLK();
    this.retrieveIdFromParameters();
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
          this.skillService
            .getSkillDetail(this.id)
            .subscribe((skillData: any) => {
              this.skill.patchValue({
                category: skillData.skillCategory.id,
                name: skillData.title,
                region: skillData.regions.map((r: { id: any }) => r.id),
                requiredProof: skillData.required_proof,
              });
            });
        }
      }
    }
  }

  lookupLK() {
    this.getCategories();
    this.getRegions();
  }

  getCategories() {
    this.skillService.getCategories().subscribe((res) => {
      let newCat = [];
      if (res.data && res.data.length) {
        newCat = res.data.map((reg: { id: any; name: any }) => {
          return {
            value: reg.id,
            text: reg.name,
          };
        });
      }
      this.categoryLK = newCat;
    });
  }

  getRegions() {
    this.skillService.getRegions().subscribe((res) => {
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
    if (this.paramId) {
      this.skillService
        .updateSkill(this.skill.value, this.paramId)
        .subscribe((data) => {
          this.toastrService.success(
            this.translateService.instant('notification.post.skill.success')
          );
          this.router.navigate(['master/skills']);
        });
    } else {
      this.skillService.addSkill(this.skill.value).subscribe((data) => {
        this.toastrService.success(
          this.translateService.instant('notification.post.skill.success')
        );
        this.router.navigate(['master/skills']);
      });
    }
  }
  navigateToDetail() {}

  ngAfterViewInit() {}
}
