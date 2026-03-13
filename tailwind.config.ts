import type { Config } from "tailwindcss";

/* eslint-disable-next-line @typescript-eslint/no-require-imports */
const pxToRem = require("tailwindcss-preset-px-to-rem");

const config: Config = {
  presets: [pxToRem],

  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
};

export default config;
