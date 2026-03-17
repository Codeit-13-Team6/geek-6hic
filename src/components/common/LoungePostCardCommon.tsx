import Image from "next/image";
import profileImg from "@/assets/img/profile/female1-sm.jpg";
import thumbsUpIcon from "@/assets/icon/thumbsUp/state-false.svg";
import messageIcon from "@/assets/icon/message/message.svg";

interface LoungePostProps {
  id: number;
  title: string;
  content: string;
  authorName: string;
  date: string;
  timeAgo: string;
  likeCount: number;
  commentCount: number;
  thumbnailUrl?: string | null;
  onDetailClick?: () => void;
}

export default function LoungePostCardCommon({
  title,
  content,
  authorName,
  date,
  timeAgo,
  likeCount,
  commentCount,
  thumbnailUrl,
  onDetailClick,
}: LoungePostProps) {
  const handleDetailClick = () => {
    onDetailClick?.();
  };

  return (
    <article
      onClick={handleDetailClick}
      className="flex cursor-pointer flex-col gap-4 transition-colors hover:bg-gray-50/50 md:flex-row md:gap-8"
    >
      {thumbnailUrl ? (
        <div className="relative hidden size-40 shrink-0 overflow-hidden rounded-[12px] md:block lg:size-50">
          <Image
            src={thumbnailUrl}
            alt="게시물 썸네일"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      ) : (
        <div className="hidden size-40 shrink-0 rounded-[12px] bg-gray-200 md:block lg:size-50" />
      )}

      <div className="flex flex-1 flex-col border-b border-slate-200 pt-4 pb-6">
        <h3 className="mb-3 text-base font-bold text-gray-800 md:mb-2 md:text-xl">
          {title}
        </h3>

        {thumbnailUrl ? (
          <div className="relative mb-3 block aspect-video w-full shrink-0 overflow-hidden rounded-[12px] md:hidden">
            <Image
              src={thumbnailUrl}
              alt="게시물 썸네일"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        ) : (
          <div className="mb-3 block aspect-video w-full shrink-0 rounded-[12px] bg-gray-200 md:hidden" />
        )}

        <p className="mb-4 line-clamp-2 text-sm text-gray-600 md:mb-0 md:text-lg">
          {content}
        </p>

        <div className="mt-auto flex items-center justify-between text-xs text-gray-400 md:text-sm">
          <div className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center">
              <Image
                src={profileImg}
                alt="프로필"
                width={24}
                height={24}
                className="rounded-full"
                unoptimized
              />
            </div>
            <span>
              {authorName} <span className="ml-1">{date}</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="mr-2">{timeAgo}</span>
            <span className="flex items-center gap-0.5">
              <Image
                src={thumbsUpIcon}
                alt="좋아요 아이콘"
                width={15}
                height={15}
                unoptimized
              />
              {likeCount}
            </span>
            <span className="flex items-center gap-0.5">
              <Image
                src={messageIcon}
                alt="댓글 아이콘"
                width={15}
                height={15}
                unoptimized
              />
              {commentCount}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
