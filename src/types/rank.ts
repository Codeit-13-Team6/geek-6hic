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

export interface TopRankCardProps {
  rank: number;
  item: RankedItem;
  onDetailClick?: () => void;
}

export interface RankCardProps {
  title?: string;
  point?: number;
  rank?: number;
  meetType?: string;
  onDetailClick?: () => void;
  image?: string;
}
