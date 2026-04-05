export default function AgentTest() {
  // 컨벤션 위반
  const login_status = false;
  const teamMembers = ["유진", "상현", "제현", "민주"];

  const SubmitButton = () => {
    return <button>제출</button>;
  };

  // 컨벤션 준수 (정상적인 코드)
  const isLoggedIn = true;
  const teamMemberList = ["유진", "상현", "제현", "민주"];

  const BtnSubmit = () => {
    return <button>제출</button>;
  };

  return (
    <div>
      <h1>AI 에이전트 마커 테스트</h1>
    </div>
  );
}
