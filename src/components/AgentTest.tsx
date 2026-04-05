/**
 * 컨벤션 위반 사례 (AI가 지적하고, 체크박스를 해제해야 함)
 */
// 1. Architecture: 화살표 함수 사용 (Function Declaration 위반)
// 2. Naming: Btn- 접두사 없음, snake_case 사용
export const login_button = () => {
  // 3. Naming: boolean 변수에 is/has/can 없음
  const loginFlag = false;
  // 4. Naming: 배열에 List 접미사 없음
  const users = ["지현", "민수"];

  // 5. URL: RESTful 위반 및 대문자 포함
  fetch("/API/Get_Users_Data");

  // 6. Styling: 의미 없는 div/span 사용 (Semantic Tag 아님)
  return (
    <div>
      <span>로그인</span>
    </div>
  );
};

/**
 * 컨벤션 준수 사례 (AI가 참고할 부분)
 */
// 1. Architecture: Function Declaration & Named Export 사용
// 2. Naming: Btn- 접두사 사용
export function BtnLogin() {
  // 3. Naming: is 접두어 사용
  const isLoggedIn = true;
  // 4. Naming: List 접미사 사용
  const userList = ["지현", "민수"];

  // 5. URL: 소문자 및 RESTful 구조 사용
  fetch("/api/users");

  // 6. Styling: Semantic Tag (section, article, nav 등) 사용
  return (
    <section>
      <button>로그인</button>
    </section>
  );
}
