import Image from "next/image";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from "@/components/shadcnOrigin/card";
import { BtnCommon } from "@/components/ui/BtnCommon";
import profileImg from "@/assets/img/banner/banner-lg.jpg";
import { RankCardProps } from "@/types";


export default function TopRankCard({
  title = "모임 이름이 없습니다.",
  point = 123123,
  rank = 0,
  meetType = "스터디",
  onDetailClick = () => {},
}: RankCardProps) {
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
  const rankData = rankNumber[rank as keyof typeof rankNumber] ?? rankNumber[0];

  return (
    <Card className="relative flex h-[141px] w-full flex-col justify-between overflow-hidden bg-gray-200 p-2 sm:h-[540px] sm:px-[22px] sm:py-[20px]">
      <Image
        src={profileImg}
        alt="프로필"
        fill
        className="object-cover"
        unoptimized
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />
      <CardHeader className="relative z-10 flex justify-end px-0 pt-2 pb-[16px] sm:pt-5">
        <div
          className={`${rankData.badgeColor} flex h-[20px] w-[50px] items-center justify-center rounded-[24px] text-sm font-semibold text-black sm:h-[24px] sm:w-[108px]`}
        >
          {rank}ND
          <span className="hidden sm:inline">&nbsp;PLACE</span>
        </div>
      </CardHeader>
      <div className="relative z-10 flex flex-col">
        <CardContent className="px-0 pb-1 sm:pb-[25px]">
          <p className="hidden pb-[8px] text-lg font-bold text-white sm:block">
            {meetType}
          </p>
          <h3 className="truncate text-3xl text-sm font-bold text-white sm:pb-[4px] sm:text-2xl">
            {title}
          </h3>
          <div className={`${rankData.pointColor}flex items-end`}>
            <p className="text-xs font-bold sm:text-3xl">{point}</p>
            <p className="pb-[1px] pl-[4px] text-xs font-bold sm:text-3xl">
              점
            </p>
          </div>
        </CardContent>

        <CardAction className="relative z-10 w-full">
          {rank === 1 ? (
            <BtnCommon
              variant="orange"
              className="h-7 rounded-md sm:h-15 sm:rounded-2xl"
              onClick={onDetailClick}
            >
              <p className="text-sm font-semibold text-gray-900 sm:text-xl">
                상세보기
              </p>
            </BtnCommon>
          ) : (
            <BtnCommon
              variant="teritary"
              className="h-7 rounded-md sm:h-15 sm:rounded-2xl"
            >
              <p className="text-sm font-semibold text-gray-900 sm:text-xl">
                상세보기
              </p>
            </BtnCommon>
          )}
        </CardAction>
      </div>
    </Card>
  );
}