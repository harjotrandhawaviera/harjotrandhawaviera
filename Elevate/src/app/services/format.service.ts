import * as moment from 'moment-timezone';

import { FormatConfig } from './../constant/formats.constant';
import { Injectable } from '@angular/core';
import { formatCurrency } from '@angular/common';

@Injectable()
export class FormatService {
  /**
   * Transforms date string using configured format for date and skips the time or not depending on parameters
   *
   * @param {Date|Moment|Number|string} date local dateObject or UTC date string
   * @param {boolean} skipTime Optional flag when the input is a datetime and the time should be skipped
   *                              while preparing the date (may have impact for the day depending on current time zone)
   * @returns {string}
   */
  date(date: any, skipTime: boolean = false, format = FormatConfig.transform.dateformat): string {
    if (date) {
      var mom;
      if (moment.isMoment(date)) {
        mom = date;
      } else {
        mom =
          skipTime || moment.isDate(date) || typeof date === 'number'
            ? moment(date)
            : moment.utc(date).tz(FormatConfig.dates.timezone);
      }
      return mom.format(format);
    }
    return '';
  }

  /**
   * Transforms date from UTC to local time string using format for date + time
   * or transform local date to string
   *
   * @param {Date|Moment|Number|string} datetime
   * @param {string} format Optional format for specific purposes
   * @returns {string}
   */
  datetime(datetime: any, format?: string) {
    if (datetime) {
      var mom;
      if (moment.isMoment(datetime)) {
        mom = datetime;
      } else {
        mom =
          moment.isDate(datetime) || typeof datetime === 'number'
            ? moment(datetime).local()
            : moment.utc(datetime).local();
      }
      return mom.format(format || FormatConfig.transform.datetimeformat);
    }
    return '';
  }

  formatCurrency(
    value: number | undefined | string,
    locale: string = 'de-DE',
    currency: string = '€',
    currencyCode: string = 'EUR',
    digitsInfo?: string
  ): string {
    if (value !== undefined) {
      if (typeof value === 'string') {
        return formatCurrency(
          Number(value),
          locale,
          currency,
          currencyCode,
          digitsInfo
        );
      } else {
        return formatCurrency(
          value,
          locale,
          currency,
          currencyCode,
          digitsInfo
        );
      }
    }
    return '';
  }
  percent(value: any) {
    return (!!value && value !== null && typeof value === 'number' && (value || 0) + '%') || '';
  }
}
