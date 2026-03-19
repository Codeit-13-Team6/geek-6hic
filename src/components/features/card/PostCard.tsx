import Image from "next/image";
import profileImg from "@/assets/img/profile/female1-sm.jpg";
import thumbsUpIcon from "@/assets/icon/thumbsUp/state-false.svg";
import messageIcon from "@/assets/icon/message/message.svg";
import defaultImg from "@/assets/img/empty/img-default.png";

interface PostDetailCardProps {
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

export default function PostCard({
  title,
  content,
  authorName,
  date,
  likeCount,
  commentCount,
  thumbnailUrl,
  onDetailClick,
}: PostDetailCardProps) {
  // 태그 제거 로직
  const getPlainText = (html: string) => {
    if (!html) return "";
    // 1. 먼저 <hr/>를 기준으로 자릅니다. ([0]번이 순수 본문, [1]번이 링크 영역)
    const splitContent = html.split(/<hr\s*\/?>|<p><a|<a/i);
    const contentOnly = splitContent[0]; // 무조건 첫 번째 덩어리(순수 본문)만 선택
    // 2. 잘라낸 본문에서만 태그를 지웁니다.
    return contentOnly
      .replace(/<\/p>|<\/li>|<\/div>|<br\s*\/?>|<\/h[1-6]>/gi, " ")
      .replace(/<[^>]*>?/gm, "")
      .replace(/&nbsp;/g, " ")
      .replace(/\s\s+/g, " ")
      .trim();
  };

  const pureContent = getPlainText(content);

  return (
    <article
      onClick={() => onDetailClick?.()}
      className="flex cursor-pointer flex-col gap-4 transition-colors hover:bg-gray-50 sm:flex-row sm:gap-8 sm:rounded-l-[12px]"
    >
      {/* 데스크탑 썸네일 */}
      <div className="relative hidden size-40 shrink-0 overflow-hidden rounded-[12px] sm:block lg:size-50">
        <img
          src={thumbnailUrl || defaultImg.src} // 1. null이면 바로 기본 이미지
          alt="게시물 썸네일"
          className="h-full w-full object-cover"
          onError={(e) => {
            // 2. 주소는 있는데 깨진 링크면 여기서 기본 이미지로 교체
            (e.target as HTMLImageElement).src = defaultImg.src;
          }}
        />
      </div>

      <div className="flex flex-1 flex-col border-b border-slate-200 px-4 pt-4 pb-6 sm:px-2">
        <h3 className="mb-3 text-base font-bold text-gray-800 sm:mb-2 sm:text-xl">
          {title}
        </h3>

        {/* 모바일 썸네일*/}
        <div className="relative mb-4 block aspect-video w-full shrink-0 overflow-hidden rounded-[12px] sm:hidden">
          <img
            src={thumbnailUrl || defaultImg.src}
            alt="게시물 썸네일"
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = defaultImg.src;
            }}
          />
        </div>

        <p className="mb-4 line-clamp-2 text-sm text-gray-600 sm:mb-0 sm:text-lg">
          {pureContent || "내용이 없는 게시글입니다."}
        </p>

        <div className="mt-auto flex items-center justify-between text-xs text-gray-400 sm:text-sm">
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
              {authorName} <span className="ml-2">{date}</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
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
