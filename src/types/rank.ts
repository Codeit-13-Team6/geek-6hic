export interface TopRankCardProps {
  title?: string;
  point?: number;
  rank?: number;
  meetType?: string;
}

export interface RankCardProps extends TopRankCardProps {
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
  image?: string;
}
