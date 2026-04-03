/**
 * ❌ 컨벤션 위반 사례 (AI가 지적해야 할 부분)
 */

// 1. Boolean 변수명 위반: is/has/can 접두어 없음 + snake_case 사용
const user_authenticated = true;
const admin_permission = false;

// 2. 배열 명명 규칙 위반: List 접미사 누락
const memberNames = ["유진", "민수", "지현"];
const active_users = ["user1", "user2"];

// 3. 버튼 컴포넌트 명명 규칙 위반: Btn- 접두사 누락
export function LogoutButton() {
  return "Logout";
}

// 4. 함수 구조 위반: 화살표 함수 대신 Function Declaration 권장 (팀 규칙에 따라)
const get_data = () => {
  return "data";
};

/**
 * ✅ 컨벤션 준수 사례 (AI가 참고해야 할 부분)
 */

// 1. Boolean 준수: is/has 접두어 사용 + camelCase
const IsAuthorized = true; // (주의: PascalCase보다는 camelCase인 isLoggedIn 권장)
const hasWriteAccess = true;

// 2. 배열 준수: List 접미사 명시
const memberNameList = ["유진", "민수", "지현"];
const userAuthList = ["READ", "WRITE"];

// 3. 버튼 준수: Btn- 접두사 사용
export function BtnLogout() {
  return "로그아웃";
}

// 4. 함수 구조 준수: Function Declaration 형태
export function getAuthProfile() {
  return {
    isAuthorized,
    memberNameList,
  };
}
