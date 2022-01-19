export interface OptionVM {
  text: string | number | undefined | null;
  info?: string | undefined | null;
  value: string | number | undefined | null;
  isWild?: boolean | undefined | null;
  data?: any;
  offers?: any;
  start_endTime?: string;
  id?: number;
}

export interface TimeZoneOptionVM {
  value: string;
  abbr: string;
  offset: number;
  isdst: boolean;
  text: string;
  utc: string[];
}
