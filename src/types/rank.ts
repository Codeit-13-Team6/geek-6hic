export interface RankedItem {
  id: number;
  commentLeng: number;
  checkScore: number;
  totalUserLeng: number;
  commentingUserList: string[];
  rankScore: number;
  meetName: string;
  meetType: string;
  dateTime: string;
  image?: string;
}

export interface TopRankCardProps {
  rank: number;
  item: RankedItem;
  isSecret?: boolean;
  onDetailClick?: () => void;
}

export interface RankCardProps {
  title?: string;
  point?: number;
  rank?: number;
  isSecret?: boolean;
  meetType?: string;
  onDetailClick?: () => void;
  image?: string;
}
