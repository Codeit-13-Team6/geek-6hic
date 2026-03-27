export interface RankCardProps {
  title?: string;
  point?: number;
  rank?: number;
  meetType?: string;
  onDetailClick?: () => void;
}

export interface RankedItem {
  id: number;
  commentLeng: number;
  checkScore: number;
  totalUserLeng: number;
  commentingUserList: string[];
  rankScore: number;
  meetName: string;
  meetType: string;
}

export interface TopRankCardProps {
  title?: string;
  point?: number;
  rank?: number;
  meetType?: string;
}
