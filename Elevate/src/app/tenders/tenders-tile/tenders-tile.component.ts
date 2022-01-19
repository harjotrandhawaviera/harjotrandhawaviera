import * as fromTender from '../state/index';
import * as fromTenderAction from './../state/tender.actions';
import * as moment from 'moment';

import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

import { ConfirmBoxComponent } from '../../core/confirm-box/confirm-box.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TenderVM } from '../../model/tender.model';
import { TranslateService } from '../../services/translate.service';
import {StorageService} from '../../services/storage.service';

@Component({
  selector: 'app-tenders-tile',
  templateUrl: './tenders-tile.component.html',
  styleUrls: ['./tenders-tile.component.scss'],
})
export class TendersTileComponent implements OnInit {
  @Input() tender?: TenderVM;

  constructor(
    private router: Router,
    private store: Store<fromTender.State>,
    public dialog: MatDialog,
    private storageService: StorageService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {}

  navigateToDetail(tender: TenderVM) {
    this.router.navigate([`/tenders/adv/${tender.job_advertisement_id}/role/${tender.staff_role_id}`]);
  }
  navigate(values: any) {
    const data =  {
      client_id: values?.snapshots?.client?.id,
      staff_role_id: values?.staff_role_id,
      job_id: values.job_id,
      job_advertisement_id: values.job_advertisement_id
    };
    this.router.navigate(['/jobs/freelancer/invite'], { state: data });
  }

  deleteRecord(tender: TenderVM) {
    if (tender.job_advertisement_id && tender.staff_role_id) {
      const dialogRef = this.dialog.open(ConfirmBoxComponent, {
        data: {
          type: 'warning',
          title: this.translateService.instant(
            'tenders.tenders.table.close.title'
          ),
          message: this.translateService.instant(
            'tenders.tenders.table.close.message'
          ),
          cancelCode: 'common.buttons.cancel',
          confirmCode: 'tenders.tenders.table.actions.close',
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result && tender.job_advertisement_id) {
          this.store.dispatch(
            new fromTenderAction.DeleteTender({id: tender.job_advertisement_id, role_id: tender.staff_role_id})
          );
        }
      });
    }
  }
}
