import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ConfirmBoxComponent } from '../../core/confirm-box/confirm-box.component';
import { FormGroup } from '@angular/forms';
import { FormatService } from './../../services/format.service';
import { HintComponent } from '../../core/hint/hint.component';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from './../../services/translate.service';

@Component({
  selector: '[app-invoice-generator-general]',
  templateUrl: './invoice-generator-general.component.html',
  styleUrls: ['./invoice-generator-general.component.scss']
})
export class InvoiceGeneratorGeneralComponent implements OnInit {

  @Input()
  displayMessage: any = {}
  @Input()
  detailGroup: any;

  @Input()
  freelancer: any;
  @Input()
  grandTotal = 0;
  @Output() submit = new EventEmitter();
  get detailGroupData() {
    return (this.detailGroup && this.detailGroup.getRawValue()) || {};
  }
  constructor(
    public dialog: MatDialog,
    public translateService: TranslateService,
    public formatService: FormatService,
  ) { }

  ngOnInit(): void {

  }

  submitClick() {
    this.dialog.open(ConfirmBoxComponent, {
      data: {
        type: 'warning',
        title: this.translateService.instant(
          'invoices.generator.generate.title'
        ),
        message: this.translateService.instant(
          'invoices.generator.generate.message'
          , { number: this.detailGroupData.number, total: this.formatService.formatCurrency(this.grandTotal) }),
        cancelCode: 'common.buttons.cancel',
        confirmCode: 'common.buttons.yes-generate',
      },
    }).afterClosed().subscribe(res => {
      this.submit.emit();
    });

  }
  openHint(template: string) {
    this.dialog.open(HintComponent, {
      data: {
        template: template
      }
    })
  }
}
