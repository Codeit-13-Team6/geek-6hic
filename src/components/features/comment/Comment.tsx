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
  id: number;
  name?: string;
  img?: string;
  date?: Date;
  content?: string;
  isOwner: boolean;
  onDelete: (id: number) => void;
}

export default function Comment({
  id,
  name = "익명",
  img,
  date = new Date(),
  content = "",
  isOwner = false,
  onDelete,
}: CommentProps) {
  return (
    <article className="flex flex-col border-b border-gray-50 py-5 last:border-none sm:py-6">
      {/* 상단: 프로필 정보 + 메뉴 버튼 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-500 sm:text-sm">
          <Image
            className="shrink-0 rounded-full"
            src={img ?? profileImg}
            alt="프로필 이미지"
            width={24}
            height={24}
          />
          <span className="font-medium text-gray-700">{name}</span>
          <span className="mx-0.5 text-gray-300">•</span>
          <span>
            {date.getFullYear()}.{date.getMonth() + 1}.{date.getDate()}
          </span>
        </div>

        {/* 메뉴 버튼: absolute 대신 flex로 배치하여 텍스트 겹침 방지 */}
        {isOwner && (
          <div className="shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <div className="cursor-pointer p-1">
                  <Image
                    src={meatballsIcon}
                    alt="상세보기 아이콘"
                    width={24}
                    height={24}
                  />
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent size="sm" align="end">
                <DropdownMenuItem onClick={() => console.log("수정")}>
                  수정하기
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => onDelete(id)}
                >
                  삭제하기
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      <div className="pt-1.5 pl-[32px] text-sm leading-relaxed text-gray-700 sm:text-base">
        {content}
      </div>
    </article>
  );
}
