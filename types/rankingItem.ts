export interface RankingBug {
  id: string;

  name: string;

  avatar: string;

  department: string;

  bugPercent: number;

  bugCount: number;

  subtaskCount: number;
}

export interface RankingProductivity {
  id: string;

  name: string;

  avatar: string;

  department: string;

  ratio: number;

  slsx: number;

  ulnl: number;
}
