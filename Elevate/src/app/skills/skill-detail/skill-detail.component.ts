import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SkillService } from '../../services/skill.service';
import { map, take } from 'rxjs/operators';
import { TranslateService } from '../../services/translate.service';
import { Observable, of } from 'rxjs';
import { SkillVM } from '../../model/skill.model';

@Component({
  selector: 'app-skill-detail',
  templateUrl: './skill-detail.component.html',
  styleUrls: ['./skill-detail.component.scss'],
})
export class SkillDetailComponent implements OnInit {
  id: any;
  paramId: any;
  skillData: SkillVM | undefined;
  constructor(
    private route: ActivatedRoute,
    private skillService: SkillService,
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
    this.skillService.getSkillDetail(params.id).subscribe((skillData) => {
      this.skillData = skillData;
    });
  }

  showValOfList(list: any[] | undefined) {
    let listwithname = [];
    if (list && list.length) {
      listwithname = list.map((l) => l.name);
    }
    if (listwithname && listwithname.length) {
      return listwithname.toString();
    } else {
      return '-';
    }
  }
}
