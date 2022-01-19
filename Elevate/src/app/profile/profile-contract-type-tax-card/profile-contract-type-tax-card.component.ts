import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { FormConfig } from '../../constant/forms.constant';
import { FreelancerService } from './../../services/freelancer.service';
import { HintComponent } from './../../core/hint/hint.component';
import { MatDialog } from '@angular/material/dialog';
import { OptionVM } from './../../model/option.model';
import { multiDocumentRequiredValidator } from '../../utility/multi-document.validator';

@Component({
  selector: 'app-profile-contract-type-tax-card',
  templateUrl: './profile-contract-type-tax-card.component.html',
  styleUrls: ['./profile-contract-type-tax-card.component.scss']
})
export class ProfileContractTypeTaxCardComponent implements OnInit, OnChanges {
  @Input()
  taxCardFormGroup: any;
  @Input()
  displayMessage: any = {};
  @Input()
  contractType: any;
  @Input()
  readonly = false;

  professionLK: OptionVM[] = [];
  taxClassLK: OptionVM[] = [];
  taxAllowanceLK: OptionVM[] = [];
  healthInsuranceTypeLK: OptionVM[] = [];
  healthInsuranceLK: OptionVM[] = [];
  professionState: any;
  professionStates: any[] = [];
  healthInsuranceType = '';
  constructor(
    private freelancerService: FreelancerService,
    public dialog: MatDialog) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.taxCardFormGroup) {
      this.onProfessionChange();
      this.onHealthInsuranceTypeChange();
    }
  }

  private onProfessionChange() {
    if (this.taxCardFormGroup) {
      const professionCrl = this.taxCardFormGroup.get('profession');
      professionCrl.valueChanges.subscribe((res: string) => {
        if (res && this.professionStates.length > 0) {
          this.professionState = this.professionStates.find(a => a.name === res);
          this.updateEvidenceValidation();
        }
      });
    }
  }
  private updateEvidenceValidation() {
    if (this.taxCardFormGroup) {
      if (this.professionState && this.professionState.needs_evidence) {
        this.taxCardFormGroup.get('evidence')?.setValidators([multiDocumentRequiredValidator()]);
      } else {
        this.taxCardFormGroup.get('evidence')?.clearValidators();
        this.taxCardFormGroup.get('evidence')?.setErrors(null);
      }
    }
  }

  private onHealthInsuranceTypeChange() {
    if (this.taxCardFormGroup) {
      const healthInsuranceTypeCrl = this.taxCardFormGroup.get('health_insurance_type');
      healthInsuranceTypeCrl.valueChanges.subscribe((res: string) => {
        this.healthInsuranceType = res;
      });
      const healthInsuranceIdCrl = this.taxCardFormGroup.get('health_insurance_id');
      healthInsuranceIdCrl.valueChanges.subscribe((res: string) => {
        if (res && this.healthInsuranceLK && this.healthInsuranceLK.length) {
          const selectedHealthInsurance = this.healthInsuranceLK.find(a => a.value === res);
          if (selectedHealthInsurance) {
            healthInsuranceTypeCrl.patchValue(selectedHealthInsurance.data.type);
          }
        }
      });
    }
  }

  ngOnInit(): void {
    this.freelancerService.getProfessionStates().subscribe((res: any) => {
      this.professionLK = res && res.data ? res.data.map((a: any) => {
        return {
          text: a.name,
          value: a.id
        }
      }) : [];
      this.professionStates = res && res.data ? res.data : [];
      if (this.taxCardFormGroup) {
        const formValues = (this.taxCardFormGroup as FormGroup).getRawValue();
        if (formValues && formValues.profession) {
          this.professionState = this.professionStates.find(a => a.name === formValues.profession);
          this.updateEvidenceValidation();
        }
      }
    });
    this.taxClassLK = FormConfig.tax_card.tax_classes.map(a => {
      return {
        text: a,
        value: a
      }
    });
    this.taxAllowanceLK = FormConfig.tax_card.child_tax_allowances.map(a => {
      return {
        text: a,
        value: a
      }
    });
    this.healthInsuranceTypeLK = FormConfig.tax_card.health_insurance_types.map(a => {
      return {
        text: a,
        value: a
      }
    });
    this.freelancerService.getHealthInsurances({ limit: 100000, only_fields: ['id', 'name', 'type'] })
      .subscribe(res => {
        this.healthInsuranceLK = res && res.data ? res.data.map(a => {
          return {
            text: a.name,
            value: a.id,
            data: {
              type: a.type
            }
          }
        }) : [];
        if (this.taxCardFormGroup) {
          const formValues = (this.taxCardFormGroup as FormGroup).getRawValue();
          if (formValues.health_insurance_id) {
            const selectedHealthInsurance = this.healthInsuranceLK.find(a => a.value === formValues.health_insurance_id);
            if (selectedHealthInsurance) {
              const healthInsuranceTypeCrl = this.taxCardFormGroup.get('health_insurance_type');
              healthInsuranceTypeCrl.patchValue(selectedHealthInsurance.data.type);
            }
          }
        }
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
