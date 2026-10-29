import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    ".next-local-heroes/**",
    ".next-local-heroes-admin/**",
    ".next-explorer-map-journey/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // File chép từ node_modules bởi scripts/copy-maplibre-worker.mjs (đã nén, không phải mã của dự án)
    "public/vendor/**",
    // Local agent tooling, reports, and generated artifacts retained in this checkout.
    ".codex-tmp/**",
    ".task-reports/**",
    ".codegraph/**",
    ".playwright-cli/**",
    "playwright-report/**",
    "test-results/**",
    "output/**",
    "outputs/**",
  ]),
]);

export default eslintConfig;
