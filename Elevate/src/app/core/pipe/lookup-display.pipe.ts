import { Pipe, PipeTransform } from '@angular/core';

import { OptionVM } from './../../model/option.model';

@Pipe({
  name: 'lookupDisplay'
})
export class LookupDisplayPipe implements PipeTransform {

  transform(value: any, option: OptionVM[] | undefined | null, ...args: unknown[]): string | number {
    if (option && value) {
      const op = option.find(a=>a.value === value);
      return op && op.text ? op.text : '';
    }
    return '';
  }

}
