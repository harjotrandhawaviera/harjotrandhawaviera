import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoleService } from '../../services/role.service';
import { map, take } from 'rxjs/operators';
import { TranslateService } from '../../services/translate.service';
import { Observable, of } from 'rxjs';
import { RoleVM } from '../../model/role.model';

@Component({
  selector: 'app-role-detail',
  templateUrl: './role-detail.component.html',
  styleUrls: ['./role-detail.component.scss'],
})
export class RoleDetailComponent implements OnInit {
  id: any;
  paramId: any;
  roleData: RoleVM | undefined;
  constructor(
    private route: ActivatedRoute,
    private roleService: RoleService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.retrieveIdFromParameters();
  }

  retrieveIdFromParameters() {
    this.route.paramMap.pipe(take(1)).subscribe((params: any) => {
      this.loadDetail(params.params);
    });
  }

  loadDetail(params: any) {
    this.roleService.getRoleDetail(params.id).subscribe((roleData) => {
      this.roleData = roleData;
    });
  }

  showValOfList(list: any[] | undefined, type: string) {
    let listwithname = [];
    if (list && list.length) {
      listwithname = list.map((l) => l[type]);
    }
    if (listwithname && listwithname.length) {
      return listwithname.toString();
    } else {
      return '-';
    }
  }
}
