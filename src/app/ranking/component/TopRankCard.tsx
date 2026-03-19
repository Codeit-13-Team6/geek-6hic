import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from "@/components/shadcnOrigin/card";
import { BtnCommon } from "@/components/ui/BtnCommon";

interface TopRankCardProps {
  title?: string;
  point?: number;
  rank?: 1 | 2 | 3 | 0;
  meetType?: string;
}

export default function TopRankCard({
  title = "모임 이름이 없습니다.",
  point = 123123,
  rank = 0,
  meetType = "스터디",
}: TopRankCardProps) {
  const rankNumber = {
    1: {
      pointColor: "text-[#ffb900] ",
      badgeColor: "bg-[#ffb900]",
    },
    2: {
      pointColor: "text-white ",
      badgeColor: "bg-[#e2e8f0]",
    },
    3: {
      pointColor: "text-white ",
      badgeColor: "bg-[#bb4d00]",
    },
    0: {
      pointColor: "text-white ",
      badgeColor: "bg-white",
    },
  };
  return (
    <Card className="flex w-full flex-col justify-between bg-gray-200 px-[22px] py-[20px] sm:h-[540px]">
      <CardHeader className="flex justify-end px-0 pb-[16px]">
        <div
          className={`${rankNumber[rank].badgeColor} flex h-[24px] w-[108px] items-center justify-center rounded-[24px] text-sm font-semibold text-black`}
        >
          {rank}ND PLACE
        </div>
      </CardHeader>
      ¬
      <div className="flex flex-col">
        <CardContent className="pb-[25px]">
          <p className="pb-[8px] text-lg font-bold text-white">{meetType}</p>
          <h3 className="text-am pb-[12px] text-3xl font-bold text-white">
            {title}
          </h3>
          <div className={`${rankNumber[rank].pointColor}flex items-end`}>
            <p className="text-3xl font-bold">{point}</p>
            <p className="pb-[1px] pl-[4px] text-lg font-bold">점</p>
          </div>
        </CardContent>

        <CardAction className="w-full">
          {rank === 1 ? (
            <BtnCommon variant="orange">
              <p className="text-xl font-semibold text-gray-900">상세보기</p>
            </BtnCommon>
          ) : (
            <BtnCommon variant="teritary">
              <p className="text-xl font-semibold text-gray-900">상세보기</p>
            </BtnCommon>
          )}
        </CardAction>
      </div>
    </Card>
  );
}
