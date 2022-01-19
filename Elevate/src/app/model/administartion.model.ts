// tslint:disable-next-line:no-empty-interface
export interface AdministrationModel {

}

export interface AdministrationModelSearchVM {
  search?: string;
  client?: string;
  agent?: string;
  email?: any;
  contractType?: string;
  state?: string;
  order?: string;
  pageSize?: number;
  pageIndex?: number;
  sortDir?: string;
  sortBy?: string;
}
