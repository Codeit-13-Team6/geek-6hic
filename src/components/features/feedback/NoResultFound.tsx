import { SearchX, Ghost, MessageSquareX, LucideIcon } from "lucide-react";
import { cn } from "@/lib";

type NoResultType = "search" | "meetings" | "myMeetings" | "lounge";

interface NoResultFoundProps {
  type?: NoResultType;
  className?: string;
}

export function NoResultFound({
  type = "meetings",
  className,
}: NoResultFoundProps) {
  const configs: Record<
    NoResultType,
    { icon: LucideIcon; title: string; desc: string }
  > = {
    search: {
      icon: SearchX,
      title: "검색 결과가 없어요.",
      desc: "찾으시는 내용이 맞는지 확인하거나, 다른 단어로 다시 검색해보세요.",
    },
    meetings: {
      icon: Ghost,
      title: "표시할 모임이 없어요.",
      desc: "가장 먼저 모임을 만들어보세요!",
    },
    myMeetings: {
      icon: Ghost,
      title: "참여 중인 모임이 없어요.",
      desc: "원하는 모임이 없다면, 직접 새로운 모임을 열어보는 건 어떨까요?",
    },
    lounge: {
      icon: MessageSquareX,
      title: "등록된 게시글이 없어요.",
      desc: "가장 먼저 라운지에 정보를 공유해보세요.",
    },
  };

  const { icon: Icon, title, desc } = configs[type];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center border-t border-slate-100 py-32 lg:col-span-2",
        className,
      )}
    >
      <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-slate-50">
        <Icon className="size-10 text-slate-200" strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-black tracking-tighter text-slate-900 uppercase">
        {title}
      </h3>
      <p className="mt-2 text-sm font-medium text-slate-400">{desc}</p>
    </div>
  );
}
