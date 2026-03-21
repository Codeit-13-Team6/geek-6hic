import Image from "next/image";
import profileImg from "@/assets/img/profile/female1-m.jpg";
import meatballsIcon from "@/assets/icon/meatballs/meatballs-lg.svg";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/shadcnOrigin/dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/DropdownCommon";

interface CommentProps {
  name?: string;
  img?: string;
  date?: Date;
  content?: string;
  isOwner: boolean;
}

export default function Comment({
  name = "익명",
  img,
  date = new Date(),
  content = "",
  isOwner = false,
}: CommentProps) {
  return (
    <article className="relative flex flex-col py-[24px]">
      <div className="flex flex-row items-center gap-[6px] text-sm text-gray-500">
        <Image
          className="rounded-[24px]"
          src={img ?? profileImg}
          alt="프로필 이미지"
          width={24}
          height={24}
        />
        <p>{name}</p>
        <p>
          {date.getFullYear()}.{date.getMonth() + 1}.{date.getDate()}
        </p>
      </div>

      <div className="absolute top-5 right-0">
        {isOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="cursor-pointer">
                <Image
                  src={meatballsIcon}
                  alt="상세보기 아이콘"
                  width={24}
                  height={24}
                />
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent size="sm">
              <DropdownMenuItem onClick={() => console.log("수정")}>
                수정하기
              </DropdownMenuItem>

              <DropdownMenuItem
                variant="destructive"
                onClick={() => console.log("삭제")}
              >
                삭제하기
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <div className="px-[2px] pt-[8px] text-lg text-gray-700">{content}</div>
    </article>
  );
}
