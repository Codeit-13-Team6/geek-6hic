import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "eslint.config.mjs",
  ]),

  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    rules: {
      // 1. 객체 타입 선언 시 무조건 interface 사용 강제 (type 사용 시 에러)
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],

      // 2. 네이밍 컨벤션 강제
      "@typescript-eslint/naming-convention": [
        "error",
        // Interface는 PascalCase 강제, 앞에 'I' 붙이는 것 절대 금지
        {
          selector: "interface",
          format: ["PascalCase"],
          custom: {
            regex: "^I[A-Z]",
            match: false,
          },
        },
        // Boolean 변수는 is, has, can, should 등으로 시작 강제
        {
          selector: "variable",
          types: ["boolean"],
          format: ["PascalCase"],
          prefix: ["is", "has", "can", "should"],
        },
        // 일반 변수와 함수는 camelCase 또는 PascalCase(컴포넌트용) 허용
        {
          selector: ["variable", "function"],
          format: ["camelCase", "PascalCase"],
          leadingUnderscore: "allow",
        },
        {
          // const로 선언된 변수(상수)는 UPPER_CASE 허용!
          selector: "variable",
          modifiers: ["const"],
          format: ["camelCase", "PascalCase", "UPPER_CASE"],
        },
      ],
    },
  },
]);

export default eslintConfig;
