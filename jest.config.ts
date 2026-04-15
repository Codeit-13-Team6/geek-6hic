import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  //무한 스크롤 위해 필요
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
<<<<<<< HEAD
  // 절대경로처리
=======
  //절대경로 용
>>>>>>> 9fb2d37082ffe05530e8b5cdf1d91475588ced35
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
