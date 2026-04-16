import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "@/components/features/form/LoginForm";
import { loginUser } from "@/api/client";

const mockSetUser = jest.fn(); // 로그인 성공 시 store에 유저정보 저장되는지 확인
const mockCloseLoginModal = jest.fn();
const mockOnSuccess = jest.fn(); // 로그인 성공 후 콜백

// url 없어서 null처리 필요
jest.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: jest.fn(() => null),
  }),
}));

// next Link이동 Next.js router 없기때문에 a태그로 변환
jest.mock("next/link", () => {
  return function MockLink({
    children,
    href,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

// next Image 없기때문에 img태그로 변환
jest.mock("next/image", () => {
  return function MockImage(props: React.ImgHTMLAttributes<HTMLImageElement>) {
    return <img {...props} alt={props.alt ?? ""} />;
  };
});

// api 모킹
jest.mock("api/client", () => ({
  loginUser: jest.fn(),
  bindAuthTokens: jest.fn(),
  loginWithGoogleToken: jest.fn(),
}));

// 구글토큰 모킹 /// 카카오는 기존에 토큰 요청없어서 안해도 됌
jest.mock("auth/googleAuth", () => ({
  requestGoogleAccessToken: jest.fn(),
}));

// store의 setUser 확인용 모킹
jest.mock("store/useAuthStore", () => ({
  useAuthStore: (selector: (state: { setUser: typeof mockSetUser }) => unknown) =>
    selector({
      setUser: mockSetUser,
    }),
}));

// store의 modal 확인용 모킹
jest.mock("store/useLoginModalStore", () => ({
  useLoginModalStore: (
    selector: (state: { closeLoginModal: typeof mockCloseLoginModal }) => unknown,
  ) =>
    selector({
      closeLoginModal: mockCloseLoginModal,
    }),
}));

// 토스트 모킹(검증은 안하고 모킹만) // 라이브러리 테스트는 안하는데 실제 사용중이면 모킹은 필요하다고 함
jest.mock("components/ui/Toast", () => ({
  Toast: jest.fn(),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("이메일이 비어 있으면 validation 에러가 노출된다", async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.type(
      screen.getByPlaceholderText("비밀번호를 입력해주세요."),
      "abc12345",
    );
    await user.click(screen.getByRole("button", { name: "로그인" }));

    expect(
      await screen.findByText("이메일을 입력해주세요."),
    ).toBeInTheDocument();
    expect(loginUser).not.toHaveBeenCalled();
  });

  test("이메일 형식이 올바르지 않으면 validation 에러가 노출된다", async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.type(
      screen.getByPlaceholderText("이메일을 입력해주세요."),
      "invalid-email",
    );
    await user.type(
      screen.getByPlaceholderText("비밀번호를 입력해주세요."),
      "abc12345",
    );
    await user.click(screen.getByRole("button", { name: "로그인" }));

    expect(
      await screen.findByText("이메일 형식이 올바르지 않습니다."),
    ).toBeInTheDocument();
    expect(loginUser).not.toHaveBeenCalled();
  });

  test("비밀번호가 비어 있으면 validation 에러가 노출된다", async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.type(
      screen.getByPlaceholderText("이메일을 입력해주세요."),
      "test@test.com",
    );
    await user.click(screen.getByRole("button", { name: "로그인" }));

    expect(
      await screen.findByText("비밀번호를 입력해주세요."),
    ).toBeInTheDocument();
    expect(loginUser).not.toHaveBeenCalled();
  });

  test("비밀번호 형식이 올바르지 않으면 validation 에러가 노출된다", async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.type(
      screen.getByPlaceholderText("이메일을 입력해주세요."),
      "test@test.com",
    );
    await user.type(
      screen.getByPlaceholderText("비밀번호를 입력해주세요."),
      "1234",
    );
    await user.click(screen.getByRole("button", { name: "로그인" }));

    expect(
      await screen.findByText("영문/숫자 포함 8자 이상"),
    ).toBeInTheDocument();
    expect(loginUser).not.toHaveBeenCalled();
  });

  test("정상 입력 시 loginUser가 호출되고 onSuccess가 실행된다", async () => {
    const user = userEvent.setup();

    (loginUser as jest.Mock).mockResolvedValue({
      ok: true,
      user: {
        id: 1,
        email: "test@test.com",
        nickname: "tester",
      },
    });

    render(<LoginForm onSuccess={mockOnSuccess} />);

    await user.type(
      screen.getByPlaceholderText("이메일을 입력해주세요."),
      "test@test.com",
    );
    await user.type(
      screen.getByPlaceholderText("비밀번호를 입력해주세요."),
      "abc12345",
    );
    await user.click(screen.getByRole("button", { name: "로그인" }));

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith({
        email: "test@test.com",
        password: "abc12345",
      });
    });

    expect(mockSetUser).toHaveBeenCalledWith({
      id: 1,
      email: "test@test.com",
      nickname: "tester",
    });
    expect(mockOnSuccess).toHaveBeenCalledTimes(1);
  });

  test("로그인 실패 시 에러 메시지가 노출된다", async () => {
    const user = userEvent.setup();

    (loginUser as jest.Mock).mockRejectedValue(new Error("login failed"));

    render(<LoginForm />);

    await user.type(
      screen.getByPlaceholderText("이메일을 입력해주세요."),
      "test@test.com",
    );
    await user.type(
      screen.getByPlaceholderText("비밀번호를 입력해주세요."),
      "abc12345",
    );
    await user.click(screen.getByRole("button", { name: "로그인" }));

    expect(
      await screen.findByText("로그인 실패. 다시 시도해주세요."),
    ).toBeInTheDocument();

  });
});