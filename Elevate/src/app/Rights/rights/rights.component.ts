import {Component, OnInit} from '@angular/core';
import {AdministrationFacade} from '../../administration/+state/administration.facade';
import {OptionVM} from '../../model/option.model';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {AdministrationModelSearchVM} from '../../model/administartion.model';
import {TranslateService} from '../../services/translate.service';
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-rights',
  templateUrl: './rights.component.html',
  styleUrls: ['./rights.component.scss']
})
export class RightsComponent implements OnInit {
  RoleList: OptionVM | any;
  dropdown = new FormControl();
  Rights: OptionVM | any;
  userRights: OptionVM | any;
  RoleData = new FormGroup({
    agentName: new FormControl('agent'),
    rightIdentifier: new FormArray([])
  });
  searchModel: AdministrationModelSearchVM = {};

  constructor(private administrationFacade: AdministrationFacade,
              private fb: FormBuilder,
              private toastrService: ToastrService,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.administrationFacade.loadRole();
    this.administrationFacade.getRoles$.subscribe((res: any) => {
      this.RoleList = this.sortOption(
        res.data
          ? res.data.map((a: any) => {
            return {
              value: a?.identifier,
              text: a?.identifier,
            };
          })
          : []
      );
    });
    this.administrationFacade.loadRights();
    this.translateService.get('rights.fields.rights').subscribe(() => {
      this.administrationFacade.getRights$.subscribe((res: any) => {
        this.Rights = this.sortOption(
          res.data
            ? res.data.map((a: any) => {
              return {
                id: a?.id,
                text: a?.identifier,
              };
            })
            : []
        );
      });
      this.administrationFacade.loadfilterRight({agentName: 'agent'});
    });
    this.translateService.get('rights.fields.rights').subscribe(() => {
      this.administrationFacade.getRightsList$.subscribe((res: any) => {
        this.userRights = this.sortOption(
          res.data
            ? res.data.map((a: any) => {
              return {
                id: a?.id,
                text: this.translateService.instant('rights.fields.rights.' + a?.identifier),
              };
            })
            : []
        );
      });
      this.administrationFacade.loadfilterRight({agentName: 'agent'});
    });
    this.RoleData.get('agentName')?.valueChanges.subscribe((res: any) => {
      // @ts-ignore
      this.searchModel = {...this.searchModel, agentName: res};
      setTimeout(() => {
        this.administrationFacade.loadfilterRight(this.searchModel);
      }, 1000);
    });
  }

// tslint:disable-next-line:typedef
  sortOption(options: OptionVM[]) {
    return options.sort((a: OptionVM, b: OptionVM) =>
      a.text && b.text ? (a.text > b.text ? 1 : b.text > a.text ? -1 : 0) : 0
    );
  }

  isCheckboxSelected(id: number ) {
    return this.userRights.some((x: any) => x.id === id);
  }

  onChange(event: any) {
      const interests = this.RoleData.get('rightIdentifier') as FormArray as FormArray;
      if (event.checked) {
        interests.push(new FormControl(event.source.value));
      } else {
        const i = interests.controls.findIndex(x => x.value === event.source.value);
        interests.removeAt(i);
      }
    }
  // // tslint:disable-next-line:typedef
  save(value: any) {
    this.administrationFacade.updateRights(value);
    this.toastrService.success(this.translateService.instant('notification.put.roles-rights.success'));
  }
}
