import React, { useState, useEffect } from "react";

// 일부러 만든 긴 컴포넌트 (200줄은 안 넘지만 로직이 섞여 있음)
// 컨벤션 체크 테스트용: Naming (명확하지 않은 이름)
const Tmp = ({ data }: { data: any }) => {
  const [val, setVal] = useState(0);
  const [list, setList] = useState([]);

  // useEffect 내 복잡한 로직 (리뷰어 지적 유도)
  useEffect(() => {
    if (data) {
      const filtered = data.filter((item: any) => item.status === "active");
      setList(filtered);
    }
  }, [data]);

  const handleBtnClick = () => {
    setVal(val + 1);
    console.log("버튼이 클릭됨"); // 불필요한 콘솔 로그
  };

  return (
    <div className="border border-gray-200 p-4">
      <h1 className="text-xl font-bold">에이전트 테스트 컴포넌트</h1>
      <p>현재 값: {val}</p>

      <button
        onClick={handleBtnClick}
        className="rounded bg-blue-500 px-4 py-2 text-white"
      >
        증가
      </button>

      <ul className="mt-4">
        {list.map((item: any, idx) => (
          <li key={idx} className="text-slate-600">
            {/* 날짜 포맷팅 테스트 (아까 배운 내용) */}
            {new Date(item.createdAt)
              .toLocaleDateString("ko-KR", {
                year: "2-digit",
                month: "2-digit",
                day: "2-digit",
              })
              .replace(/\. /g, "/")
              .replace(/\./g, "")}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tmp;
