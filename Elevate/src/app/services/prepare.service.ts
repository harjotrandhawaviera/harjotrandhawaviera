import * as moment from 'moment-timezone';

import { FormatConfig } from './../constant/formats.constant';
import { Injectable } from '@angular/core';
import { formatCurrency } from '@angular/common';

@Injectable()
export class PrepareService {
  /**
   * Internal - prepares date string using configured format for date and skips the time or not depending on arguments
   * @param {type} date
   * @param {boolean} skipTime Optional flag when the input is a datetime and the time should be skipped
   *                           while preparing the date (may have impact for the day depending on current time zone)
   * @returns {type}
   */
  date(date: any, skipTime: boolean) {
    if (date) {
      let mom = (moment.isMoment(date) && date) || moment(date);
      return skipTime
        ? mom.format(FormatConfig.prepare.dateformat)
        : mom.utc().format(FormatConfig.prepare.dateformat);
    }
    return undefined;
  }

  /**
   * Internal - prepares date string from local time to UTC using configured format for date + time
   * @param {type} datetime
   * @returns {type}
   */
  datetime(datetime: any) {
    let prepared = JSON.parse(JSON.stringify(datetime));

    if (typeof prepared === 'number') {
      prepared = new Date(prepared);
    }
    // prepared is local date and needs to be converted to default (configured) timezone first
    if (prepared && moment.isDate(prepared)) {
      // get offsets
      var localTzOffset = new Date().getTimezoneOffset();
      var defaultTzOffset = moment
        .tz(moment.utc(), FormatConfig.dates.timezone)
        .utcOffset();
      // move time of defaults timezone
      prepared.setMinutes(
        prepared.getMinutes() - (localTzOffset + defaultTzOffset)
      );
    }
    var mom =
      prepared && ((moment.isMoment(prepared) && prepared) || moment(prepared));
    return (
      (mom && mom.utc().format(FormatConfig.prepare.datetimeformat)) ||
      undefined
    );
  }
}
