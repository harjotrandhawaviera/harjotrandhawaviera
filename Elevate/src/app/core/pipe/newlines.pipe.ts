import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'newlines'
})
export class NewlinesPipe implements PipeTransform {

  transform(value: string | undefined | null, ...args: unknown[]): unknown {
    if (value) {
      return value.replace(/\n/g, '<br/>');
    }
    return '';
  }

}
