import Link from "next/link";

export default function MeetingsNotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-[1280px] flex-col items-center justify-center px-6 text-center">
      <h1 className="text-2xl font-black tracking-tight text-slate-900">
        삭제되었거나 존재하지 않는 모임입니다.
      </h1>
      <p className="mt-3 text-sm font-medium text-slate-400">
        모임 목록으로 돌아가 다른 모임을 확인해보세요.
      </p>
      <Link
        href="/meetings"
        className="bg-main-purple mt-6 rounded-xl px-5 py-3 text-sm font-bold text-white"
      >
        모임 목록으로
      </Link>
    </div>
  );
}
