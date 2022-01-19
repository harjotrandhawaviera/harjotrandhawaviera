import { formatCurrency } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currency',
  pure: false
})
export class AppCurrency implements PipeTransform {
  transform(value: number | undefined, locale: string = 'de-DE', currency: string = '€', currencyCode: string = 'EUR', digitsInfo?: string): string {
    if (value !== undefined) {
      return formatCurrency(value, locale, currency, currencyCode, digitsInfo);
    }
    return '';
  }
}

// export class CurrencyPipe implements CurrencyPipe {
//   constructor(
//     private translateService: TranslateService,
//     private ref: ChangeDetectorRef
//   ) {
//     // super(translateService, ref);
//   }
//   transform(value: string): string {
//     let returnCode = '';
//     if (value) {
//       if (value === 'GBP') {
//         returnCode = 'CURRENCY.GBP';
//       }
//     }
//     if (returnCode) {
//       return super.transform(returnCode);
//     }
//     return '';
//   }

// }
