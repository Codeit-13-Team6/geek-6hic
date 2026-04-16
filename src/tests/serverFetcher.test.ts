/** @jest-environment node */

import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import {
  isPublicPath,
  serverAxios,
  serverFetch,
} from "@/lib/auth/fetcher.server";
import { GET as proxyRouteGET } from "@/app/api/[...slug]/route";
import { GET as myPostsVisibleRouteGET } from "@/app/api/users/me/posts-visible/route";



jest.mock("next/headers", () => ({ cookies: jest.fn() }));

// Next.js 의 redirect() 는 실제로 NEXT_REDIRECT 에러를 throw 함 → 동일하게 모킹
jest.mock("next/navigation", () => ({
  redirect: jest.fn().mockImplementation((url: string) => {
    throw Object.assign(new Error("NEXT_REDIRECT"), {
      digest: `NEXT_REDIRECT;replace;${url};;`,
    });
  }),
}));

const BASE = process.env.NEXT_PUBLIC_API_URL!;

/** sub 필드만 가진 최소 JWT 모킹 토큰 */
function makeMockJwt(sub: string) {
  const header = Buffer.from('{"alg":"HS256"}').toString("base64");
  const payload = Buffer.from(JSON.stringify({ sub })).toString("base64");
  return `${header}.${payload}.sig`;
}

/** cookies() 반환값을 원하는 토큰으로 세팅
 *  set() 을 실제로 내부 store 에 반영 → setTokenCookies 호출 후 재시도 시 새 토큰 읽힘 */
function setupCookies(tokens: { accessToken?: string; refreshToken?: string }) {
  const store: Record<string, string | undefined> = { ...tokens };

  (cookies as jest.Mock).mockResolvedValue({
    get: (name: string) => (store[name] ? { value: store[name] } : undefined),
    set: (name: string, value: string) => { store[name] = value; },
  });
}

function setupCookiesWithSetFailure(tokens: { accessToken?: string; refreshToken?: string }) {
  const store: Record<string, string | undefined> = { ...tokens };

  (cookies as jest.Mock).mockResolvedValue({
    get: (name: string) => (store[name] ? { value: store[name] } : undefined),
    set: () => {
      throw new Error("set-cookie-not-available");
    },
  });
}


const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => {
  server.resetHandlers();
  jest.clearAllMocks();
  // 맵 계속 남아서 그냥 초기화
  const globalStore = globalThis as { __refreshMap?: Map<string, unknown> };
  if (globalStore.__refreshMap) {
    globalStore.__refreshMap.clear();
  }
});
afterAll(() => server.close());

// 비로그인 상태일 떄 접근 불가 페이지 확인

describe("isPublicPath", () => {
  it("/users/me → private", () => expect(isPublicPath(`${BASE}/users/me`)).toBe(false));
  it("/meetings/123/join → private", () => expect(isPublicPath(`${BASE}/meetings/123/join`)).toBe(false));
  it("/meetings/123/favorites → private", () => expect(isPublicPath(`${BASE}/meetings/123/favorites`)).toBe(false));
  it("undefined → false", () => expect(isPublicPath(undefined)).toBe(false));
});

//  요청 시 경우의 수 확인

describe("request interceptor", () => {
  it("refreshToken 없고 public path면 요청을 통과시킨다", async () => {
    setupCookies({});

    let postsCallCount = 0;
    let refreshCallCount = 0;

    server.use(
      http.post(`${BASE}/auth/refresh`, () => {
        refreshCallCount++;
        return HttpResponse.json({
          accessToken: "should-not-be-called",
          refreshToken: "rt",
        });
      }),
      http.get(`${BASE}/posts`, () => {
        postsCallCount++;
        return HttpResponse.json({ data: [] });
      }),
    );

    const response = await serverAxios.get("/posts");

    expect(response.status).toBe(200);
    expect(postsCallCount).toBe(1);
    expect(refreshCallCount).toBe(0);
  });

  it("refreshToken 없고 private path면 요청을 차단한다", async () => {
    setupCookies({});

    let meCallCount = 0;
    server.use(
      http.get(`${BASE}/users/me`, () => {
        meCallCount++;
        return HttpResponse.json({ id: 1 });
      }),
    );

    await expect(serverAxios.get("/users/me")).rejects.toMatchObject({
      response: { status: 401, data: { code: "REFRESH_FAILED" } },
    });
    expect(meCallCount).toBe(0);
  });

  it("accessToken 이 있으면 refresh 없이 요청을 통과시킨다", async () => {
    setupCookies({ accessToken: makeMockJwt("1"), refreshToken: makeMockJwt("1") });

    let meetingsCallCount = 0;
    let refreshCallCount = 0;

    server.use(
      http.post(`${BASE}/auth/refresh`, () => {
        refreshCallCount++;
        return HttpResponse.json({ accessToken: "unexpected", refreshToken: "unexpected" });
      }),
      http.get(`${BASE}/meetings`, () => {
        meetingsCallCount++;
        return HttpResponse.json({ data: [] });
      }),
    );

    const response = await serverAxios.get("/meetings");

    expect(response.status).toBe(200);
    expect(meetingsCallCount).toBe(1);
    expect(refreshCallCount).toBe(0);
  });

  it("accessToken 이 없고 refreshToken 이 있으면 refresh 후 요청을 통과시킨다", async () => {
    setupCookies({ refreshToken: makeMockJwt("1") });

    let meetingsCallCount = 0;
    let refreshCallCount = 0;

    server.use(
      http.post(`${BASE}/auth/refresh`, () => {
        refreshCallCount++;
        return HttpResponse.json({ accessToken: "refreshed-token", refreshToken: "new-rt" });
      }),
      http.get(`${BASE}/meetings`, () => {
        meetingsCallCount++;
        return HttpResponse.json({ data: [] });
      }),
    );

    const response = await serverAxios.get("/meetings");

    expect(response.status).toBe(200);
    expect(meetingsCallCount).toBe(1);
    expect(refreshCallCount).toBe(1);
  });

  it("accessToken 이 없고 refreshToken 이 있지만 refresh 가 실패하면 요청을 차단한다", async () => {
    setupCookies({ refreshToken: makeMockJwt("1") });

    let meetingsCallCount = 0;
    server.use(
      http.post(`${BASE}/auth/refresh`, () =>
        HttpResponse.json({ message: "expired" }, { status: 401 }),
      ),
      http.get(`${BASE}/meetings`, () => {
        meetingsCallCount++;
        return HttpResponse.json({ data: [] });
      }),
    );

    await expect(serverAxios.get("/meetings")).rejects.toMatchObject({
      response: { status: 401, data: { code: "REFRESH_FAILED" } },
    });
    expect(meetingsCallCount).toBe(0);
  });
});


// 응답 인터셉터 경우의 수 확인

describe("response interceptor", () => {

  it("엑세스 토큰이 만료되었을경우", async () => {
    const accessToken = makeMockJwt("1");
    const refreshToken = makeMockJwt("1");
    setupCookies({ accessToken, refreshToken });

    let meCallCount = 0;
    let refreshCallCount = 0;

    server.use(
      http.post(`${BASE}/auth/refresh`, () => {
        refreshCallCount++;
        return HttpResponse.json({ accessToken: "refreshed-token", refreshToken: "new-rt" });
      }),
      http.get(`${BASE}/users/me`, () => {
        meCallCount++;
        if (meCallCount === 1) {
          return HttpResponse.json({}, { status: 401 });
        }
        return HttpResponse.json({ id: 1 });
      }),
    );

    const response = await serverAxios.get("/users/me");

    expect(response.data).toEqual({ id: 1 });
    expect(meCallCount).toBe(2);
    expect(refreshCallCount).toBe(1);
  });

  it("리프레쉬 토큰이 만료되었을경우 ", async () => {
    const accessToken = makeMockJwt("1");
    const refreshToken = makeMockJwt("1");
    setupCookies({ accessToken, refreshToken });

    let meCallCount = 0;
    let refreshCallCount = 0;
    server.use(
      http.get(`${BASE}/users/me`, () => {
        meCallCount++;
        return HttpResponse.json({}, { status: 401 });
      }),
      http.post(`${BASE}/auth/refresh`, () => {
        refreshCallCount++;
        return HttpResponse.json({ message: "Expired" }, { status: 401 });
      }),
    );

    await expect(serverAxios.get("/users/me")).rejects.toMatchObject({
      response: { data: { code: "REFRESH_FAILED" } },
    });
    expect(meCallCount).toBe(1);
    expect(refreshCallCount).toBe(1);
  });

  it("첫 요청 401 이후에 리프레쉬 성공했음에도 다음 요청이 401 이면 요청 차단 , 무한재시도 방어되는가 테스트 ", async () => {
    const accessToken = makeMockJwt("1");
    const refreshToken = makeMockJwt("1");
    setupCookies({ accessToken, refreshToken });

    let meCallCount = 0;
    let refreshCallCount = 0;
    server.use(
      http.get(`${BASE}/users/me`, () => {
        meCallCount++;
        return HttpResponse.json({}, { status: 401 });
      }),
      http.post(`${BASE}/auth/refresh`, () => {
        refreshCallCount++;
        return HttpResponse.json({ accessToken: "new-token", refreshToken: "new-rt" });
      }),
    );

    await expect(serverAxios.get("/users/me")).rejects.toMatchObject({
      response: { status: 401 },
    });
    expect(meCallCount).toBe(2);
    expect(refreshCallCount).toBe(1);
  });

  it("401 이 아닌 에러(403)는 refresh 안씀", async () => {
    const accessToken = makeMockJwt("1");
    const refreshToken = makeMockJwt("1");
    setupCookies({ accessToken, refreshToken });

    let refreshCallCount = 0;
    server.use(
      http.post(`${BASE}/auth/refresh`, () => {
        refreshCallCount++;
        return HttpResponse.json({ accessToken: "unexpected", refreshToken: "unexpected" });
      }),
      http.get(`${BASE}/users/me`, () =>
        HttpResponse.json({ message: "Forbidden" }, { status: 403 }),
      ),
    );

    await expect(serverAxios.get("/users/me")).rejects.toMatchObject({
      response: { status: 403 },
    });
    expect(refreshCallCount).toBe(0);
  });

  it("401 응답에서 refreshToken 이 없으면 REFRESH_FAILED 로 차단한다", async () => {
    const accessToken = makeMockJwt("1");
    setupCookies({ accessToken }); // refreshToken 없음

    server.use(
      http.get(`${BASE}/users/me`, () => HttpResponse.json({}, { status: 401 })),
    );

    await expect(serverAxios.get("/users/me")).rejects.toMatchObject({
      response: { status: 401, data: { code: "REFRESH_FAILED" } },
    });
  });
});


// refreshAccessToken — 동시 요청 처리

describe("refreshAccessToken - 동시 요청 처리", () => {
  it("같은 userId 의 동시 요청 refresh API 는 1번만 호출", async () => {
    setupCookies({ refreshToken: makeMockJwt("1") }); // accessToken 없음 → 모두 refresh 트리거

    let refreshCallCount = 0;
    server.use(
      http.post(`${BASE}/auth/refresh`, async () => {
        refreshCallCount++;
        await new Promise((r) => setTimeout(r, 30)); // 지연으로 동시성 재현
        return HttpResponse.json({ accessToken: "concurrent-token", refreshToken: "new-rt" });
      }),
      http.get(`${BASE}/meetings`, () => HttpResponse.json({ data: [] })),
    );

    await Promise.all([
      serverAxios.get("/meetings"),
      serverAxios.get("/meetings"),
      serverAxios.get("/meetings"),
    ]);

    expect(refreshCallCount).toBe(1);
  });

  it("첫 요청 후 refresh 결과를 캐시 → 이후 순차 요청도 refresh 1번", async () => {
    setupCookies({ refreshToken: makeMockJwt("1") });

    let refreshCallCount = 0;
    server.use(
      http.post(`${BASE}/auth/refresh`, () => {
        refreshCallCount++;
        return HttpResponse.json({ accessToken: "cached-token", refreshToken: "rt" });
      }),
      http.get(`${BASE}/meetings`, () => HttpResponse.json({ data: [] })),
    );

    await serverAxios.get("/meetings"); // refresh 발생
    await serverAxios.get("/meetings"); // 캐시 사용

    expect(refreshCallCount).toBe(1);
  });

  it("캐시된 토큰이 만료(401) → forceRefresh 로 새 refresh 수행", async () => {
    setupCookies({ refreshToken: makeMockJwt("1") });

    let refreshCallCount = 0;
    server.use(
      http.post(`${BASE}/auth/refresh`, () => {
        refreshCallCount++;
        if (refreshCallCount === 1) {
          return HttpResponse.json({
            accessToken: "cached-token",
            refreshToken: makeMockJwt("1"),
          });
        }
        return HttpResponse.json({
          accessToken: "force-refreshed",
          refreshToken: makeMockJwt("1"),
        });
      }),
      http.get(`${BASE}/meetings`, () => HttpResponse.json({ data: [] })),
      http.get(`${BASE}/users/me`, ({ request }) => {
        const auth = request.headers.get("authorization");
        if (auth === "Bearer cached-token") {
          return HttpResponse.json({}, { status: 401 });
        }
        return HttpResponse.json({ id: 1 });
      }),
    );

    await serverAxios.get("/meetings"); // refreshMap 에 cached-token 저장
    const response = await serverAxios.get("/users/me"); // 401 후 forceRefresh

    expect(response.data).toEqual({ id: 1 });
    expect(refreshCallCount).toBe(2);
  });

  it("같은 userId에서 401 응답이 동시에 발생해도 forceRefresh 는 1번만 추가 호출", async () => {
    setupCookies({ refreshToken: makeMockJwt("1") });

    let refreshCallCount = 0;
    server.use(
      http.post(`${BASE}/auth/refresh`, async () => {
        refreshCallCount++;
        await new Promise((r) => setTimeout(r, 20));

        if (refreshCallCount === 1) {
          return HttpResponse.json({
            accessToken: "cached-token",
            refreshToken: makeMockJwt("1"),
          });
        }

        return HttpResponse.json({
          accessToken: "force-refreshed",
          refreshToken: makeMockJwt("1"),
        });
      }),
      http.get(`${BASE}/meetings`, () => HttpResponse.json({ data: [] })),
      http.get(`${BASE}/users/me`, ({ request }) => {
        const auth = request.headers.get("authorization");
        if (auth === "Bearer cached-token") {
          return HttpResponse.json({}, { status: 401 });
        }
        return HttpResponse.json({ id: 1 });
      }),
    );

    //  캐시 토큰 생성 (refresh 1회)
    await serverAxios.get("/meetings");

    //  같은 시점 401 두 건 -> forceRefresh 동시 진입
    const [res1, res2] = await Promise.all([
      serverAxios.get("/users/me"),
      serverAxios.get("/users/me"),
    ]);

    expect(res1.data).toEqual({ id: 1 });
    expect(res2.data).toEqual({ id: 1 });
    expect(refreshCallCount).toBe(2); // 초기 1회 + forceRefresh 1회
  });

  it("서로 다른 userId 요청은 캐시를 공유하지 않는지 테스트", async () => {
    let refreshCallCount = 0;
    server.use(
      http.post(`${BASE}/auth/refresh`, () => {
        refreshCallCount++;
        return HttpResponse.json({ accessToken: `token-${refreshCallCount}`, refreshToken: `rt-${refreshCallCount}` });
      }),
      http.get(`${BASE}/meetings`, () => HttpResponse.json({ data: [] })),
    );

    setupCookies({ refreshToken: makeMockJwt("1") });
    await serverAxios.get("/meetings");

    setupCookies({ refreshToken: makeMockJwt("2") });
    await serverAxios.get("/meetings");

    expect(refreshCallCount).toBe(2);
  });

  // 나중에 개선
  it("cookies().set 실패해도 refresh 결과로 요청은 계속 통과한다", async () => {
    setupCookiesWithSetFailure({ refreshToken: makeMockJwt("1") });

    let refreshCallCount = 0;
    let meetingsCallCount = 0;

    server.use(
      http.post(`${BASE}/auth/refresh`, () => {
        refreshCallCount++;
        return HttpResponse.json({
          accessToken: "fallback-token",
          refreshToken: makeMockJwt("1"),
        });
      }),
      http.get(`${BASE}/meetings`, ({ request }) => {
        meetingsCallCount++;
        const auth = request.headers.get("authorization");
        if (auth !== "Bearer fallback-token") {
          return HttpResponse.json({}, { status: 401 });
        }
        return HttpResponse.json({ data: [] });
      }),
    );

    const first = await serverAxios.get("/meetings");
    const second = await serverAxios.get("/meetings");

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect(meetingsCallCount).toBe(2);
    expect(refreshCallCount).toBe(1);
  });
});



// 서버패치 테스트
describe("serverFetch wrapper", () => {
  it("성공 응답이면 redirect 없이 데이터를 그대로 반환한다", async () => {
    const accessToken = makeMockJwt("1");
    const refreshToken = makeMockJwt("1");
    setupCookies({ accessToken, refreshToken });

    server.use(
      http.get(`${BASE}/users/me`, () => HttpResponse.json({ id: 1, name: "tester" })),
    );

    const response = await serverFetch({ method: "GET", url: "/users/me" });
    expect(response.data).toEqual({ id: 1, name: "tester" });
    expect(redirect).not.toHaveBeenCalled();
  });

  it("REFRESH_FAILED 에러 → redirect('/login') 를 호출한다", async () => {
    setupCookies({}); // 토큰 없음 + private path → REFRESH_FAILED

    // redirect() 가 NEXT_REDIRECT 를 throw 하므로 rejects 처리
    await expect(
      serverFetch({ method: "GET", url: "/users/me" }),
    ).rejects.toThrow("NEXT_REDIRECT");

    expect(redirect).toHaveBeenCalledWith("/login");
  });

  it("REFRESH_FAILED 가 아닌 에러(500) → redirect 없이 그냥 throw", async () => {
    const accessToken = makeMockJwt("1");
    const refreshToken = makeMockJwt("1");
    setupCookies({ accessToken, refreshToken });

    server.use(
      http.get(`${BASE}/users/me`, () =>
        HttpResponse.json({ message: "Internal Server Error" }, { status: 500 }),
      ),
    );

    await expect(
      serverFetch({ method: "GET", url: "/users/me" }),
    ).rejects.toMatchObject({ response: { status: 500 } });

    expect(redirect).not.toHaveBeenCalled();
  });
});

describe("SSR deferred cookie commit", () => {
  it("[...slug] Route Handler: SSR에서 cookies().set 실패해도 응답에서 auth 쿠키를 커밋한다", async () => {
    setupCookiesWithSetFailure({ refreshToken: makeMockJwt("1") });

    server.use(
      http.post(`${BASE}/auth/refresh`, () =>
        HttpResponse.json({
          accessToken: "deferred-access-token",
          refreshToken: makeMockJwt("1"),
        }),
      ),
      http.get(`${BASE}/users/me`, () => HttpResponse.json({ id: 1, name: "tester" })),
    );

    const request = new NextRequest("http://localhost:3000/api/users/me");
    const response = await proxyRouteGET(request, {
      params: Promise.resolve({ slug: ["users", "me"] }),
    });

    expect(response.status).toBe(200);
    expect((await response.json()).id).toBe(1);
    expect(response.cookies.get("accessToken")?.value).toBe("deferred-access-token");
    expect(response.cookies.get("refreshToken")?.value).toBe(makeMockJwt("1"));
  });

  it("BFF Route Handler(/api/users/me/posts-visible): deferred 토큰을 응답 쿠키로 커밋한다", async () => {
    setupCookiesWithSetFailure({ refreshToken: makeMockJwt("1") });

    server.use(
      http.post(`${BASE}/auth/refresh`, () =>
        HttpResponse.json({
          accessToken: "deferred-access-token-bff",
          refreshToken: makeMockJwt("1"),
        }),
      ),
      http.get(`${BASE}/users/me/posts`, () =>
        HttpResponse.json({
          data: [
            {
              id: 100,
              teamId: "t1",
              title: "hello",
              content: "world",
              image: null,
              authorId: 1,
              viewCount: 0,
              likeCount: 0,
              createdAt: "2026-01-01T00:00:00.000Z",
              updatedAt: "2026-01-01T00:00:00.000Z",
              author: { id: 1, name: "tester", image: null },
              _count: { comments: 0 },
              comments: [],
              isLiked: false,
            },
          ],
          totalCount: 1,
          hasMore: false,
          nextCursor: null,
          limit: 10,
        }),
      ),
    );

    const request = new Request(
      "http://localhost:3000/api/users/me/posts-visible?offset=0&limit=10",
    );
    const response = await myPostsVisibleRouteGET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(body.data)).toBe(true);
    expect(response.cookies.get("accessToken")?.value).toBe(
      "deferred-access-token-bff",
    );
    expect(response.cookies.get("refreshToken")?.value).toBe(makeMockJwt("1"));
  });
});
