export interface RankingBug {
  id: string;

  name: string;

  username: string;

  avatar: string;

  project: string;

  bugPercent: number;

  bugCountMissing: number;

  bugCount: number;

  subtaskCount: number;
}

export interface RankingProductivity {
  id: string;

  name: string;

  username: string;

  avatar: string;

  project: string;

  ratio: number;

  slsx: number;

  ulnl: number;
}
