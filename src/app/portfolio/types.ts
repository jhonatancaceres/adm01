export interface Year {
  year: number;
  current: boolean;
}

export interface Account {
  id: number;
  name: string;
}

export interface AssetItem {

  id: number;
  amount: number;
  date: Date;
  account: Account;
  ym?: number;

}

export interface AssetsFilters {
  year?: number;
}


export interface GeneralData {
  general: any;
  periods: { ym: number, date: Date }[];
  accounts: Account[];
  kpi: any
}