export default function Notification() {
  return (
    <div className="h-[358px] w-[314px] rounded-3xl bg-white px-6 pt-6 pb-4 shadow-[0_8px_40px_rgba(0,0,0,0.12)]">
      <div className="flex justify-between gap-2">
        <h2 className="font-pretendard text-lg font-semibold text-gray-900">
          알림 내역
        </h2>
        <button className="text-md text-gray-400 transition-opacity hover:text-gray-600">
          모두 읽기
        </button>
      </div>
    </div>
  );
}
