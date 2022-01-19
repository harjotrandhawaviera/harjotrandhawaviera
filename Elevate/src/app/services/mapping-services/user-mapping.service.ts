import { Injectable } from '@angular/core';
import { MultipleResponse } from '../../model/response';
import { OptionVM } from '../../model/option.model';
import { UserResponse } from '../../model/user.response';

@Injectable()
export class UsersMappingService {
  constructor() {}

  sortOption(options: OptionVM[]) {
    return options.sort((a: OptionVM, b: OptionVM) =>
      a.text && b.text ? (a.text > b.text ? 1 : b.text > a.text ? -1 : 0) : 0
    );
  }
  creatorLKResponseToVM(res: MultipleResponse<UserResponse>): OptionVM[] {
    return this.sortOption(
      res.data
        ? res.data.map((a) => {
            return {
              value: a.id,
              text:
                a.contact?.data?.lastname + ' ' + a.contact?.data?.firstname,
            };
          })
        : []
    );
  }
}
