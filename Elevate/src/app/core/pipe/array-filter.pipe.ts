import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByType',
})
export class ArrayFilterPipe implements PipeTransform {
  transform(list: any[], type: string): any[] {
    if (list) {
      return list.filter((x: any) => x.type === type);
    }
    return [];
  }
}
