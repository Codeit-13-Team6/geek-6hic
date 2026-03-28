import Image from "next/image";
import profileImg from "@/assets/img/profile/female1-sm.jpg";
import defaultImg from "@/assets/img/empty/img-default.png";
import { getPlainText } from "@/lib/contentLinkUtils";
import { cn } from "@/lib/utils";

const LikeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M7 10v12" />
    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.53l-1.6 7A2 2 0 0 1 18.23 21H7a2 2 0 0 1-2-2V11a2 2 0 0 1 .59-1.41L11.5 4a3.5 3.5 0 0 1 3.5 1.88z" />
  </svg>
);

const MessageIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
  </svg>
);

export default function PostCard({
  title,
  content,
  authorName,
  date,
  likeCount,
  commentCount,
  thumbnailUrl,
  onDetailClick,
}: any) {
  const pureContent = getPlainText(content);

  return (
    <article
      onClick={onDetailClick}
      className="group flex cursor-pointer flex-col gap-6 transition-all sm:flex-row sm:gap-10"
    >
      {/* 썸네일: 소프트 라운드 적용 */}
      <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-2xl border border-slate-100 sm:aspect-square sm:h-40 sm:w-40 lg:h-48 lg:w-48">
        <img
          src={thumbnailUrl || defaultImg.src}
          alt="썸네일"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = defaultImg.src;
          }}
        />
      </div>

      <div className="flex flex-1 flex-col justify-center border-b border-slate-100 pb-10 group-last:border-none sm:pb-0">
        <div className="mb-4">
          <h3 className="mb-2 text-lg leading-tight font-black tracking-tight text-slate-950 transition-colors group-hover:text-[#260656] sm:text-2xl">
            {title}
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed font-medium text-slate-500 sm:text-base sm:leading-normal">
            {pureContent || "내용이 없는 게시글입니다."}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-6 w-6 overflow-hidden rounded-full border border-slate-200">
              <Image
                src={profileImg}
                alt="프로필"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="flex gap-2 text-[11px] font-bold text-slate-400">
              <span className="text-slate-900">{authorName}</span>
              <span>•</span>
              <span>{date}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-[11px] font-black text-[#260656]">
              <LikeIcon />
              <span>{likeCount}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-black text-slate-400">
              <MessageIcon />
              <span>{commentCount}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
