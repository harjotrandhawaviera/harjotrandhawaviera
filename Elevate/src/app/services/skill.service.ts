import { HttpClient } from '@angular/common/http';
import { SearchRequestVM } from './../model/search.model';
import { MultipleResponse } from '../model/response';

import { BaseService } from './base.service';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { SkillResponse } from '../model/skill.response';
import { map } from 'rxjs/operators';
import { SkillVM } from '../model/skill.model';

@Injectable({
  providedIn: 'root',
})
export class SkillService extends BaseService {
  public SkillTree = new Subject();
  constructor(private http: HttpClient) {
    super();
  }
  getSkills(searchRequest: SearchRequestVM): Observable<any> {
    return this.http.get<any>(
      environment.api + this.getSearchURL('/skills', searchRequest)
    );
  }

  getCategories(): Observable<any> {
    return this.http.get<any>(environment.api + '/skill-categories');
  }

  getRegions(): Observable<any> {
    return this.http.get<any>(environment.api + '/regions');
  }

  addCategory(skillCategory: string): Observable<any> {
    return this.http
      .post<any>(environment.api + '/skill-categories', {
        name: skillCategory,
      })
      .pipe(map((res) => res.data));
  }

  addSkill(skillBody: {
    category: number;
    name: string;
    region: number;
    requiredProof: number;
  }) {
    return this.http.post<any>(environment.api + '/skills', {
      required_proof: skillBody.requiredProof,
      title: skillBody.name,
      skill_category_id: skillBody.category,
      region_ids: skillBody.region || [],
    });
  }

  updateSkill(
    skillBody: {
      category: number;
      name: string;
      region: number;
      requiredProof: number;
    },
    skillId: string
  ) {
    return this.http.post<any>(environment.api + '/skills/' + skillId, {
      required_proof: skillBody.requiredProof,
      title: skillBody.name,
      skill_category_id: skillBody.category,
      region_ids: skillBody.region || [],
    });
  }

  getSkillDetail(skillId: string): Observable<SkillVM> {
    return this.http
      .get<any>(environment.api + '/skills/' + skillId)
      .pipe(map((skillRes: any) => skillRes.data));
  }

  removeSkill(skillId: string) {
    return this.http.delete<any>(environment.api + '/skills/' + skillId);
  }

  getSkillsTree() {
    return this.getSkills({}).pipe(map(data => {
      const tree: any = {};
      data.data.forEach((d: any) => {
        if(!tree[d.skillCategory['name']]) {
          tree[d.skillCategory['name']] = {};
        }
        tree[d.skillCategory['name']][d.id] = d.title;
      })
      return tree;
    }))
  }
}
