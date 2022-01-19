export interface CountryResponse {
  name?:         string;
  nationality?:  string;
  cca2?:         string;
  currency?:     string[];
  capital?:      string;
  region?:       string;
  subregion?:    string;
  languages?:    any[] | { [key: string]: string };
  lat?:          string;
  lon?:          string;
  is_eu_member?: boolean;
}
