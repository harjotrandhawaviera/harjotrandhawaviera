import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileSize'
})
export class FileSizePipe implements PipeTransform {

  transform(value: number | string | undefined | null, precision: number = 2, ...args: unknown[]): unknown {
    if (value) {
      const units = [' B', ' kB', ' MB', ' GB', ' TB', ' PB'];
      let res = Number(value);
      let i = 0;
      while (res >= 1000) {
          res = res / 1000;
          i++;
      }
      return res.toFixed(precision).toLocaleString() + units[i];
    }
    return '';
  }

}
