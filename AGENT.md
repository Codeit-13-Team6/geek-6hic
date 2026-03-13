# 🤖 AI Agent Coding Standards (AGENTS.md)

이 파일은 프로젝트의 절대적인 코딩 컨벤션을 정의합니다. 모든 AI 에이전트는 작업을 수행하기 전 이 규칙을 숙지하고 100% 준수해야 합니다.

## 1. Naming & Syntax

- **Variable/Function**: Use `camelCase`.
  - Use `const`. Avoid `let`, NEVER use `var`.
  - Boolean: Start with `is`, `has`, `can`.
  - Array: End with `List` (e.g., `artistList`).
- **Constant (Static Data)**: Use `UPPER_CASE` with underscores (e.g., `NAV_LINKS`, `MAX_COUNT`).
- **Function**:
  - Event Handler: Start with `handle` (e.g., `handleClick`).
  - Props: Use `on` prefix (e.g., `onClick`).
  - API Call: Use method name as prefix (e.g., `getUserId`, `postKeyword`).
- **Interface & Type**: Use `PascalCase` for names, `camelCase` for members.
  - **Interface**: MUST use for Object definitions. NEVER use `I` as a prefix (e.g., Use `User`, NOT `IUser`).
  - **Type**: Use ONLY for Unions, Intersections, or Primitives.
- **Component**: Use `PascalCase`.
  - Button components MUST start with `Btn` (e.g., `BtnSubmit`).
  - _Exception_: Do NOT change the names of components inside `src/components/ui/` (shadcn/ui auto-generated files).

## 2. Component Architecture

- **Declaration**: Components MUST use **Function Declarations**.
  - `export function ComponentName() { ... }`
- **Exports**: Use **Named Exports** only. NEVER use `export default`.
- **Patterns**:
  - Modals: Use **Compound Component Pattern** (`Modal.Header`, `Modal.Body`).
  - Others: Single component (Props-based).
- **Hooks/Utils**: Use **Arrow Functions**.

## 3. URL Design Rules (RESTful)

- **Hierarchy**: Use slashes (`/`) to show relationships (e.g., `/animals/mammals/whales`).
- **Trailing Slashes**: NEVER include a trailing slash at the end of a URI.
- **Hyphens (-)**: Use hyphens to improve readability.
- **Underscores (\_)**: NEVER use underscores in URIs.
- **Lowercase**: All URI paths MUST be lowercase.

## 4. Styling (Tailwind CSS - Updated)

- **Units (표준 Tailwind 단위 사용)**:
  - `shadcn/ui`와의 완벽한 호환성을 위해 **Tailwind 기본 단위(1 = 0.25rem = 4px)**를 사용한다.
  - 피그마 수치를 적용할 때: **피그마 px 값 ÷ 4 = 클래스 숫자** (예: 40px -> `w-10`, 24px -> `gap-6`)
  - 폰트/모서리: 기본 별명을 적극 활용한다. (14px -> `text-sm`, 16px -> `text-base`, 8px -> `rounded-lg`)
  - 4배수가 딱 떨어지지 않는 픽셀 값은 임의 값 `[]`을 허용한다. (예: `w-[18px]`, `text-[13px]`)

## 5. SEO & Development Rules

- **SEO**: Use semantic tags (`section`, `nav`, `p`) instead of `div`.
- **Images**: Always include `alt` attributes.
- **Imports**: Always use `@/` path alias.
- **Loops**: Prefer `map`, `filter`. Avoid `for` loops.
- **Rendering**: Use ternary or `&&` for conditional rendering inside JSX. `key` must be a unique ID.

## 6. Formatting

- **Indent**: 2 spaces.
- **Quotes**: Single quotes (`'`).
- **Comments**: Write above the code, start with a space: `// Comment`.
- **Destructuring**: Use extensively for props and objects.
