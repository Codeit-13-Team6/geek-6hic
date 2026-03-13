# 🤖 AI Agent Coding Standards (AGENTS.md)

이 파일은 프로젝트의 절대적인 코딩 컨벤션을 정의합니다. 모든 AI 에이전트는 작업을 수행하기 전 이 규칙을 숙지하고 100% 준수해야 합니다.

## 1. Naming & Syntax

- **Variable/Function**: Use `camelCase`.
  - Use `const`. Avoid `let`, NEVER use `var`.
  - Boolean: Start with `is`, `has`, `can`.
  - Array: End with `List` (e.g., `artistList`).
- **Function**:
  - Event Handler: Start with `handle` (e.g., `handleClick`).
  - Props: Use `on` prefix (e.g., `onClick`).
  - API Call: Use method name as prefix (e.g., `getUserId`, `postKeyword`).
- **Interface & Type**: Use `PascalCase` for names, `camelCase` for members.
  - **Object Definition**: MUST use `interface`. NEVER use `type` for objects.
  - **Type Alias**: Use only for Unions, Intersections, or Primitives.
  - **Naming**: NEVER use `I` as a prefix for interfaces.
- **Constant**: Use `UPPER_CASE` with underscores.
- **Component**: Use `PascalCase`.
  - Button components MUST start with `Btn` (e.g., `BtnSubmit`).

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

### 4. Styling (Tailwind CSS)

- **Units (Strict)**: NEVER use arbitrary values like `w-[24px]`.
  - Use numeric classes based on Figma px values (e.g., `w-24`, `h-40`, `text-16`, `rounded-10`).
  - Avoid standard aliases like `text-sm`, `rounded-lg` in favor of numeric classes.
- **Hardcoding**: NEVER hardcode Hex colors. Use CSS variables from `globals.css` (e.g., `bg-main-green-500`).
- **Dynamic Classes**: MUST use `cn()` utility function.

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
