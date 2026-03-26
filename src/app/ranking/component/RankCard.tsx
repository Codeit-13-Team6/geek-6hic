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
    <Card className="flex flex-row justify-evenly gap-2 bg-white px-3 py-2 ring-0! sm:h-[100px] sm:justify-between sm:gap-0 sm:px-[32px] sm:py-[10px]">
      <CardContent className="flex min-w-0 shrink-0 flex-row items-center justify-center px-0">
        <article className="flex shrink-0 flex-row items-center justify-center px-0">
          <div className="text-main-green-500 pr-2 text-base font-semibold sm:pr-[32px] sm:text-xl">
            {rank}
          </div>
          <div className="relative flex h-12 w-12 !shrink-0 items-center justify-center overflow-hidden rounded-xl bg-transparent sm:h-[71px] sm:w-[71px] sm:rounded-[24px]">
            <Image
              src={profileImg}
              alt="프로필"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        </article>
        <section className="flex w-[110px] flex-col justify-center pl-2 sm:w-auto sm:max-w-[740px] sm:pr-[80px] sm:pl-[32px]">
          <h3 className="text-md truncate font-semibold text-ellipsis whitespace-nowrap text-black sm:text-xl">
            {title}
          </h3>
          <p className="text-sm font-bold text-gray-500 sm:text-lg">
            {meetType}
          </p>
        </section>
      </CardContent>
      <CardAction className="flex flex-row items-center gap-2 py-[20px] sm:gap-[32px]">
        <p className="text-main-green-600 flex items-end text-sm font-bold whitespace-nowrap sm:text-2xl">
          {point}점
        </p>
        <BtnCommon
          onClick={onDetailClick}
          variant="outline"
          size="sm"
          className="w-20 rounded-lg sm:w-[125px]"
        >
          상세보기
        </BtnCommon>
      </CardAction>
    </Card>
  );
}
