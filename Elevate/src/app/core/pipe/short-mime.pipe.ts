import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortMime',
})
export class ShortMimePipe implements PipeTransform {
  transform(
    value: string | undefined | null,
    precision: number = 2,
    ...args: unknown[]
  ): unknown {
    if (value) {
      if (value.indexOf('/jpeg') > 0) {
        return 'jpg';
      }
      if (value.indexOf('/') > 0) {
        return value.split('/')[1];
      }
    }
    return '';
  }
}
