export interface SkillSearchVM {
  page?: number;
  search?: string;
  id?: number;
  skillCategory?: any;
  title?: string;
  region?: any[];
  createdDate?: string;
  pageSize?: number;
  pageIndex?: number;
  sortDir?: string;
  sortBy?: string;
  sort_by_column?: string;
  order_by?: string;
  filters?: any[];
  category?: string;
}

export interface SkillVM {
  id?: number;
  skillCategory?: any;
  title?: string;
  regions?: any[];
  createdDate?: string;
  required_proof?: number;
}

export interface SkillResponse {
  pageInfo?: any;
  list?: any[];
  id?: number;
  skillCategory: any;
  title: string;
  regions: any[];
  createdDate?: string;
}
