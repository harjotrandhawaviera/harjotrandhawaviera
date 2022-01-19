import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'telNumber'
})
export class TelNumberPipe implements PipeTransform {

  transform(value: string): string {
    return value && value.replace(/ /g, '');
  }

}
