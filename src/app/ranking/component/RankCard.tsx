import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from "@/components/shadcnOrigin/card";
import { BtnCommon } from "@/components/ui/BtnCommon";
import Image from "next/image";
import profileImg from "@/assets/img/banner/banner-lg.jpg";

interface RankCardProps {
  title?: string;
  point?: number;
  rank?: number;
  meetType?: string;
  onDetailClick?: () => void;
}

export default function RankCard({
  title = "모임 이름이 없습니다.",
  point = 123123,
  rank = 0,
  meetType = "스터디",
  onDetailClick = () => {},
}: RankCardProps) {
  return (
    <Card className="flex flex-row justify-between gap-0 bg-white px-[32px] py-[10px] ring-0! sm:h-[100px]">
      <CardContent className="flex min-w-0 shrink-0 flex-row items-center justify-center px-0">
        <article className="flex shrink-0 flex-row items-center justify-center px-0">
          <div className="text-main-green-500 pr-[32px] text-xl font-semibold">
            {rank}
          </div>
          <div className="w-[71px]!shrink-0 flex h-[71px]! items-center justify-center rounded-[24px] bg-gray-600">
            <Image
              src={profileImg}
              alt="프로필"
              width={71}
              height={71}
              className=""
              unoptimized
            />
          </div>
        </article>
        <section className="flex max-w-[740px] flex-col justify-center pr-[80px] pl-[32px]">
          <h3 className="truncate text-xl font-semibold text-ellipsis whitespace-nowrap text-black">
            {title}
            {title}
            {title}
            {title}
            {title}
            {title}
            {title}
            {title}
          </h3>
          <p className="text-lg font-bold text-gray-500">{meetType}</p>
        </section>
      </CardContent>
      <CardAction className="flex flex-row items-center gap-[32px] py-[20px]">
        <p className="text-main-green-600 flex items-end text-2xl font-bold whitespace-nowrap">
          {point}점
        </p>
        <BtnCommon
          onClick={onDetailClick}
          variant="outline"
          size="sm"
          className="w-[125px]"
        >
          상세보기
        </BtnCommon>
      </CardAction>
    </Card>
  );
}
