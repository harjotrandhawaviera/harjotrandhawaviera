/*
 * Various formats
 */
export const FormatConfig = {
  transform: {
    dateformat: 'MMM D, YYYY',
    datetimeformat: 'MMM D, YYYY, HH:mm',
    timeformat: 'HH:mm',
    fulldatetime: 'MMM D, YYYY HH:mm:ss',
  },
  prepare: {
    dateformat: 'YYYY-MM-DD',
    datetimeformat: 'YYYY-MM-DD HH:mm:ss',
    timeformat: 'HH:mm',
  },
  check: {
    postcodePattern: /^[a-zA-Z0-9][a-zA-Z0-9\- ]{0,10}[a-zA-Z0-9]$/i,
    postcodeRangePattern: /^([0-9]{5})[ ]*-*[ ]([0-9]{5})*$/i,
    passwordPattern:
      '.*([^a-zA-Z0-9]{1,}.*[A-Z]{1,}|[A-Z]{1,}.*[^a-zA-Z0-9]{1,}).*',
    numberPattern: /^[+-]?([0]|[1-9][0-9]{0,9}([\\.,]{1}[0-9]{1,2})?|[0][\\.,]{1}[0-9]{1,2})$/,
    positiveNumberPattern: /^[+]?([0]|[1-9][0-9]{0,9}([\\.,]{1}[0-9]{1,2})?|[0][\\.,]{1}[0-9]{1,2})$/,
    dateInterval: /^([0-9]+Y)?([0-9]+M)?([0-9]+W)?([0-9]+D)?(T(?=[0-9])([0-9]+H)?([0-9]+M)?([0-9]+S)?)?$/,
    ibanPattern: /^[A-Z]{2}[0-9]{2}[a-zA-Z0-9]{1,30}$/,
    positiveIntegerPattern: /^\d+$/,
    taxIdPattern: /^\d{11}$/,
    socialSecurityPattern: /^\d{8}[a-zA-Z]{1}\d{3}$/,
  },
  versionStringLength: 15,
  datepicker: 'dd.MM.yyyy',
  dates: {
    timezone: 'Europe/Berlin',
    locale: 'de-DE',
  },
};
