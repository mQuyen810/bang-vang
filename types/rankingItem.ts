export interface RankingBug {
  id: string;

  name: string;

  username: string;

  avatar: string;

  bugPercent: number;

  bugCount: number;

  subtaskCount: number;
}

export interface RankingProductivity {
  id: string;

  name: string;

  username: string;

  avatar: string;

  ratio: number;

  slsx: number;

  ulnl: number;
}
