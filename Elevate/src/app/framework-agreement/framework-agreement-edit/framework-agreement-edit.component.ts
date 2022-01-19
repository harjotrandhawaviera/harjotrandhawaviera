import * as moment from 'moment';

import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {Component, Input, OnInit} from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';

import {AdministrationFacade} from '../../administration/+state/administration.facade';
import {ContractTypesService} from '../../services/contract-types.service';
import {DatePipe} from '@angular/common';
import {FileExportService} from '../../services/file-export.service';
import { MY_FORMATS } from '../../model/date-format.model';
import {OptionVM} from '../../model/option.model';
import {ProjectDocumentVM} from '../../model/project.model';
import {TranslateService} from '../../services/translate.service';
import {of} from 'rxjs';

@Component({
  selector: 'app-framework-agreement-edit',
  templateUrl: './framework-agreement-edit.component.html',
  styleUrls: ['./framework-agreement-edit.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class FrameworkAgreementEditComponent implements OnInit {
  @Input()
  templateDocuments: ProjectDocumentVM[] | null = [];
  gtcs = new FormGroup({
    identifier: new FormControl('', [Validators.required]),
    contract_type: new FormControl('', [Validators.required]),
    published_at: new FormControl('', [Validators.required]),
    valid_at: new FormControl('', [Validators.required]),
    invalid_at: new FormControl(),
    docTypes: new FormControl(),
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    confirmation_type: new FormControl('', [Validators.required]),
    reconfirmation_type: new FormControl('', [Validators.required]),
    reassurance: new FormControl('', [Validators.required]),
    reconfirmation_interval: new FormControl('', [Validators.required])
  });
  contractTypeLK: OptionVM[] = [];
  id = '';
  paramId: any;
  result: any = of([]);
  show = false;
  documents: OptionVM | any;
  frameworkData: OptionVM | any;
  displayMessage: any = {};
  selectDate = new Date();
  reconfirmation: any;
  reassurance: any;
  selected = '1' ;
  modeselect = 'terms and condition'
  private values: OptionVM | any;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private administrationFacade: AdministrationFacade,
              private translateService: TranslateService,
              private contractTypesService: ContractTypesService,
              private fileExportService: FileExportService,
              private datePipe: DatePipe) {
    this.selectDate.setDate(this.selectDate.getDate());
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      // @ts-ignore
      this.paramId = +params.get('id');
    });
    this.administrationFacade.FrameworkDetail(this.paramId);
    this.administrationFacade.getFrameworkDetails$.subscribe((res: any) => {
      if (res?.data) {
        this.result = res?.data;
        this.values = this.documents,
        this.frameworkData = {
          published_at: res?.data?.published_at,
          valid_at: res?.data?.valid_at
        }
        this.documents = this.result?.documents.data.map((a: any) => {
          // tslint:disable-next-line:max-line-length
          return {
            name: a?.name,
            type: a?.type,
            description: a?.description,
            confirmation_type: a?.confirmation_type ,
            reconfirmation_type: a?.reconfirmation_type,
            original_filename: a?.document?.data?.original_filename,
            url: a?.document?.data?.url,
            size: a?.document?.data?.size,
            mime: a?.document?.data?.mime
          };
        });
        if (this.paramId) {
          this.translateService.get('contracts.identifier').subscribe(() => {
          this.gtcs.patchValue({
            identifier: this.result.identifier,
            contract_type: this.translateService.instant('contracts.identifier.' + this?.result?.contract_type?.data?.identifier),
            published_at: moment.utc(this.result.published_at).local().format('MM/DD/YYYY'),
            valid_at: this.result.valid_at,
            description: this?.result?.documents?.data?.description,
            name: this?.values?.name
          });
          });
        }
      }
    });
    this.translateService.get('contracts').subscribe((p) => {
      this.contractTypesService.getContractTypes({}).subscribe((res) => {
        this.contractTypeLK = this.sortOption(
          res.data
            ? res.data.map((a) => {
              return {
                value: a.id,
                text: this.translateService.instant(
                  'contracts.identifier.' + a.identifier
                ),
              };
            })
            : []
        );
      });
    });

    this.translateService.get('administration').subscribe((a) => {

    } );
  }
different()
{
  if (this.gtcs.get('published_at')?.value > this.gtcs.get('valid_at')?.value)
  {
    this.gtcs.get('valid_at')?.reset();
  }
}
  sortOption(options: OptionVM[]) {
    return options.sort((a: OptionVM, b: OptionVM) =>
      a.text && b.text ? (a.text > b.text ? 1 : b.text > a.text ? -1 : 0) : 0
    );
  }

  addfield() {
    this.show = !this.show;
  }

  saveDetail(lists: any) {
    const newObject = {
      identifier: lists?.identifier,
      published_at: lists?.published_at,
      valid_at: lists?.valid_at,
      invalid_at: lists?.invalid_at,
      docTypes: lists?.docTypes,
      name: lists?.name,
      description: lists?.description,
      confirmation_type: lists?.confirmation_type,
      reconfirmation_type: lists?.reconfirmation_type,
    };
    this.administrationFacade.updateFramework(Number(this.paramId), newObject);
    // this.administrationFacade.updateCDeploy(contObject);
    this.router.navigate(['administration', 'gtcs']);
  }



  creategtcs(list: any) {
    if (this.gtcs.valid) {
      const publishDate = this.gtcs.get('published_at')?.value;
      const validDate = this.gtcs.get('valid_at')?.value;
      const publish = this.datePipe.transform(publishDate, 'yyyy-MM-dd yy:hh:ss');
      const valid = this.datePipe.transform(validDate, 'yyyy-MM-dd yy:hh:ss');
      const value = {
        contract_type_id: list?.contract_type,
        identifier: list?.identifier,
        published_at: publish,
        valid_at: valid
      }
      this.administrationFacade.addgtcs(value);
    }
  }
  // download(lists: any) {
  //   //   this.fileExportService.getDownload({
  //   //     url: lists?.url,
  //   //     fileName: lists?.original_filename,
  //   //     mimeType: lists?.mime,
  //   //   });
  //   // }

  download(doc: any) {
    this.fileExportService.getDownload({ url: doc.url, fileName: doc.original_filename, mimeType: doc.mime });
  }

}
