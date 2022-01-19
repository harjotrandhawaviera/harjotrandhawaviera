import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { formatCurrency } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { map } from 'rxjs/operators';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';

@Pipe({
  name: 'imageAvatar'
})
export class AppImageAvatar implements PipeTransform {
  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {

  }
  transform(id: number, size?: string): Observable<SafeUrl> {
    const url = id ? environment.api + `/pictures/${id}/${(size || 'icon')}/squared` : '';
    return this.http.get(url,
      { responseType: 'blob' })
      .pipe(map(val => {
        const blobData = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(val));
        return blobData;
      }));
    // return id ? environment.api + `/pictures/${id}/${(size || 'icon')}/squared` : '';
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
