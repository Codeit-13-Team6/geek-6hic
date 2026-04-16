# ☕️ co-git

코드잇 스프린터 전용 모임 매칭 및 소통 플랫폼입니다.  
흩어진 자료는 묶고, 스프린터들이 더 쉽게 연결될 수 있도록 만든 라운지형 서비스입니다.

## 🔗 Project Links

- Deploy: https://cogit-kr.vercel.app/meetings

## 📌 서비스 개요

- 주제: 코드잇 스프린터 수강생 전용 모임 매칭 및 소통 플랫폼
- 타겟: 코드잇 스프린터 수강생
- 메인 슬로건: `스프린터 전용 소통 라운지, co-git`
- 서브 슬로건: `함께(co-) 만들고, 기록은 남기는(git) 스프린터의 공간`

## ❓ Why

스프린터들이 정보를 공유하고 모임을 찾는 과정에는 몇 가지 분명한 불편함이 있었습니다.

- 디스코드나 ZEP에서는 대화가 쌓일수록 중요한 모집글과 학습 자료가 위로 밀려 다시 찾기 어려웠습니다.
- 필요한 정보를 체계적으로 저장하거나 아카이빙하기 어려워, 지식 공유가 일회성으로 끝나는 경우가 많았습니다.
- 모임 정보가 여러 채널에 흩어져 있어 한눈에 보기 어렵고, 참여 방식도 제각각이라 실제 참여까지의 과정이 번거로웠습니다.

co-git는 모임 탐색, 커뮤니티 소통, 자료 아카이빙을 한곳에서 이어갈 수 있도록 만들었습니다.

## 📌 Key Features

- 스프린트 라운지: 게시글, 댓글, 쓰레드 기반 자료 아카이빙
- 모임 매칭: 검색, 필터, 날짜 정보 기반 모임 탐색 및 참여
- 커뮤니티 강화: 핫게시물과 랭킹을 통한 자발적 참여 유도
- 마이페이지: 프로필, 통계, 유저 타입, 타 유저 페이지 조회

## 🛠 Tech Stack

- **Core**  
  ![Next.js 16](https://img.shields.io/badge/Next.js%2016-000000?style=flat-square&logo=next.js&logoColor=white)
  ![React 19](https://img.shields.io/badge/React%2019-61DAFB?style=flat-square&logo=react&logoColor=0B1220)
  ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
  ![Tailwind CSS 4](https://img.shields.io/badge/Tailwind%20CSS%204-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)

- **Data / State**: TanStack Query, Axios, Zustand
- **UI / Interaction**: shadcn/ui, Base UI, Lucide React, Framer Motion

## 📂 Directory Structure

```text
src/
├── api/                                   # 클라이언트/서버 API 호출 함수
│   ├── client/
│   └── server/
├── app/                                   # App Router 페이지 및 Route Handler
│   ├── (auth)/
│   │   ├── login/                         # 로그인 페이지
│   │   └── signup/                        # 회원가입 페이지
│   ├── about-team/                        # 프로젝트 및 팀 소개 페이지
│   ├── api/                               # Next.js Route Handler 기반 Proxy / BFF Route
│   │   ├── [...slug]/                     # 일반 백엔드 요청 프록시
│   │   ├── auth/
│   │   │   ├── login/                     # 로그인 처리
│   │   │   ├── logout/                    # 로그아웃 처리
│   │   │   ├── signup/                    # 회원가입 처리
│   │   │   └── token/                     # 토큰 재발급 처리
│   │   ├── hot/                           # 핫게시물 데이터 Route
│   │   ├── lounge/
│   │   │   └── posts/                     # 라운지 목록 조합 Route
│   │   ├── meetings/
│   │   │   └── my/                        # 나의 모임 조회 Route
│   │   ├── meetingsRecommend/
│   │   │   └── [id]/                      # 추천 모임 조합 Route
│   │   ├── oauth/
│   │   │   └── kakao/                     # 카카오 OAuth 처리
│   │   ├── ranking/                       # 랭킹 데이터 조합 Route
│   │   └── users/
│   │       ├── [id]/
│   │       │   ├── meetings-visible/      # 유저 공개 모임 조회 Route
│   │       │   └── posts-visible/         # 유저 공개 게시글 조회 Route
│   │       └── me/
│   │           └── posts-visible/         # 내 게시글 조회 Route
│   ├── lounge/
│   │   ├── [id]/
│   │   │   └── _components/               # 라운지 상세 전용 컴포넌트
│   │   ├── _components/
│   │   │   └── editor/                    # 라운지 에디터 관련 컴포넌트
│   │   ├── _hooks/                        # 라운지 전용 훅
│   │   ├── create/                        # 라운지 작성 페이지
│   │   └── edit/
│   │       └── [id]/                      # 라운지 수정 페이지
│   ├── meetings/
│   │   ├── [id]/
│   │   │   ├── _components/               # 모임 상세 전용 컴포넌트
│   │   │   ├── _hooks/                    # 모임 상세 전용 훅
│   │   │   └── _lib/                      # 모임 상세 전용 유틸
│   │   ├── _components/
│   │   │   └── modal/                     # 모임 전용 모달 컴포넌트
│   │   ├── _hooks/                        # 모임 전용 훅
│   │   └── _lib/                          # 모임 전용 유틸
│   ├── my-meetings/
│   │   └── _components/                   # 나의 모임 전용 컴포넌트
│   ├── oauth/
│   │   └── kakao/                         # OAuth 콜백 페이지
│   ├── ranking/
│   │   ├── _components/                   # 랭킹 전용 컴포넌트
│   │   └── _hooks/                        # 랭킹 전용 훅
│   └── users/
│       └── [id]/
│           ├── _components/               # 유저 페이지 전용 컴포넌트
│           ├── _hooks/                    # 유저 페이지 전용 훅
│           └── _lib/                      # 유저 페이지 전용 유틸
├── assets/                                # 이미지, 아이콘 등 정적 에셋
├── bff/                                   # BFF 조합 로직
├── components/                            # 공통 및 도메인 UI 컴포넌트
│   ├── boundary/                          # SSR prefetch / hydration boundary 컴포넌트
│   ├── features/
│   │   ├── btn/
│   │   ├── card/
│   │   ├── comment/
│   │   ├── feedback/
│   │   ├── form/
│   │   └── list/
│   ├── layout/                            # 레이아웃 및 알림 컴포넌트
│   ├── modal/                             # 공통 모달 컴포넌트
│   ├── skeleton/                          # 스켈레톤 UI
│   └── ui/                                # 공통 UI 및 이미지 관련 컴포넌트
├── constants/                             # 상수 관리
├── hooks/
│   └── queries/                           # TanStack Query 기반 데이터 훅
├── lib/                                   # 공통 유틸 및 인증 관련 로직
│   └── auth/                              # auth 관련 유틸 로직
├── providers/                             # Query, Toast 등 전역 Provider
├── store/                                 # Zustand 상태 관리
├── tests/                                 # 테스트 코드
└── types/                                 # 전역 타입


```

## 🏗 Core Architecture

co-git는 Next.js 서버 레이어를 거치는 BFF 구조를 중심으로 설계했습니다.

- `Proxy / BFF Route`
  - 일반적인 데이터 조회와 인증이 필요한 요청은 `/api` 경로를 통해 처리합니다.
  - 인증 처리와 실제 백엔드 통신은 서버에서 중계합니다.
  - 일부 응답은 서버에서 다시 조합해 화면에 맞는 형태로 반환합니다.

- `Server / Client Fetcher 분리`
  - `src/lib/auth/fetcher.server.ts`: 쿠키 기반 토큰 처리, refresh, retry, `refreshMap`을 통한 동시 요청 제어
  - `src/lib/auth/fetcher.client.ts`: `/api` 기준 호출, `REFRESH_FAILED` 응답 시 로그인 라우팅 처리

- `호출 구조 분리`
  - API 호출 함수는 순수 호출만 담당합니다.
  - Query 훅은 캐시, 조회, 갱신 흐름을 담당합니다.
  - BFF 조합 로직은 `src/bff/*`로 분리했습니다.

## 🔌 API Structure

### Proxy / BFF Route

- `src/app/api/[...slug]/route.ts`
- `src/app/api/auth/login/route.ts`
- `src/app/api/auth/logout/route.ts`
- `src/app/api/auth/signup/route.ts`
- `src/app/api/auth/token/route.ts`
- `src/app/api/oauth/kakao/route.ts`
- `src/app/api/hot/route.ts`
- `src/app/api/lounge/posts/route.ts`
- `src/app/api/meetings/my/route.ts`
- `src/app/api/meetingsRecommend/[id]/route.ts`
- `src/app/api/ranking/route.ts`
- `src/app/api/users/[id]/meetings-visible/route.ts`
- `src/app/api/users/[id]/posts-visible/route.ts`
- `src/app/api/users/me/posts-visible/route.ts`

역할:

- 백엔드 API 요청 중계
- 인증 토큰 처리
- 허용된 경로만 프록시
- 화면에 필요한 형태로 데이터 조합
- 첫 진입 데이터 서버 준비

### BFF Composition Layer

- `src/bff/*`
- Route Handler와 서버 페이지에서 공통으로 사용하는 응답 조합 로직을 관리합니다.

### Server API Calls

- `src/api/server/*`
- 서버 컴포넌트와 API 서비스 레이어에서 사용하는 서버 전용 API 호출 함수를 관리합니다.

### Client API Calls

- `src/lib/auth/fetcher.client.ts`
- `src/api/client/*`
- `src/hooks/queries/*`

역할:

- `fetcher.client`는 `/api` 기준 호출을 담당합니다.
- `src/api/client/*` 는 순수 API 호출 함수를 관리합니다.
- `src/hooks/queries/*` 는 TanStack Query 기반 캐시, 조회, 갱신 흐름을 담당합니다.

## 🧩 Trouble Shooting

- `refreshMap`으로 중복 refresh를 제어했습니다.
- App Router + BFF 구조로 인증 흐름을 서버 중심으로 재구성했습니다.
- prefetch / hydration / infinite scroll / optimistic update로 체감 대기 시간을 줄였습니다.
- `src/bff/*` 레이어에서 visible 데이터와 추천/목록 응답을 화면에  
  맞게 재조합했습니다.
- 링크 XSS 방어 로직을 추가해 보안 리스크에 대응했습니다.

## ⚙️ Environment

이 프로젝트는 프론트엔드 코드만 공개되어 있으며, 전체 기능을 동일하게 실행하려면 별도의 백엔드 서버가 필요합니다.

```env
NEXT_PUBLIC_API_URL=...
```

백엔드 서버 주소와 실제 환경 변수 값은 제공 기관의 자산에 해당하므로, 이 저장소에서는 공개하지 않습니다.

## 👥 Team

5명의 프론트엔드 팀이 역할을 나누어 기획, UI 구현, 데이터 흐름 설계, BFF 연동을 함께 진행했습니다.  
아래 영역을 중심으로 협업했습니다.

- 유진: 라운지 도메인 전반, 핫게시물, 검색/필터, 게시글 상세·생성·수정, 라운지 SSR/무한스크롤, 주요 화면 UI 디테일
- 제현: Proxy/BFF 구조, 서버 패처·Route Handler, 마이페이지/유저페이지 구조 정리, 랭킹 연동, 폴더 구조 리팩터링 및 유저플로우 안정화
- 상현: 로그인/회원가입, 모임찾기 UX, GNB·Footer·공통 UI, 접근성 개선, about-team 페이지 및 전반적인 사용성 보완
- 민주: 인증/OAuth, 토큰 갱신 흐름, 마이페이지·나의 모임 데이터 연결, 통계·페이지네이션·애니메이션, 알림, 테스트 기반 정리
- 병택: 모임 생성/상세 도메인 전반, 추천 모임, 공유 기능, 출석·참여 인터랙션, 스레드 알림 예외 처리, 상세 API 연결 및 분기 처리

## 🤝 Contribution & Contact

co-git는 다음 기수도 참고하고 이어갈 수 있는 형태를 지향합니다.  
더 나은 기능이 떠올랐거나, 고치고 싶은 지점이 있다면 이 저장소 위에 변경 사항을 남겨 주세요.

1. 이슈를 확인하거나 개선 내용을 정리합니다.
2. 브랜치를 생성해 작업합니다.
3. 변경 내용을 정리한 뒤 PR을 작성합니다.

프로젝트에 대해 궁금한 점이 있거나, 전하고 싶은 이야기가 있다면  
아래 메일로 편하게 연락 주세요.

cogit.kr@gmail.com
