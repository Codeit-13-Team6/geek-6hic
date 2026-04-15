import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  //무한 스크롤 위해 필요
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  // 절대경로처리
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testPathIgnorePatterns: ["/node_modules/", "/.claude/"],
};

const jestConfigFn = createJestConfig(config);

export default async () => {
  const cfg = await jestConfigFn();
  return {
    ...cfg,
    transformIgnorePatterns: [
      "/node_modules/(?!(msw|rettime|until-async|type-fest)/)",
      "/.next/",
    ],
  };
};
