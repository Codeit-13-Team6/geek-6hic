// 1. Naming & Syntax 위반 (is/has/can 접두어 없음, snake_case 사용)
const login_status = true;
const check_auth = false;

// 2. Array Naming 위반 (List 접미사 없음)
const users = ["Alice", "Bob", "Charlie"];

// 3. 버튼 접두어 위반 (Btn- 미사용)
export function LoginButton() {
  return "Login";
}

// --------------------------------------------------
// 아래는 컨벤션을 잘 지킨 코드 (AI가 칭찬할 포인트)
// --------------------------------------------------

// 4. Naming & Syntax 준수 (is 접두어, camelCase)
const isLoggedIn = true;
const canAccessAdmin = false;

// 5. Array Naming 준수 (List 접미사)
const adminList = ["Dave", "Eve"];

// 6. 버튼 접두어 준수 (Btn-)
export function BtnLogin() {
  const isAuthorized = true;
  return isAuthorized ? "Welcome" : "Please Login";
}

// 7. Structure 준수 (Function Declaration 형태)
export function getAuthInfo() {
  return {
    isLoggedIn,
    adminList,
  };
}
