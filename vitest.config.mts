import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    // The endpoint comes from the environment now, so the suite supplies its
    // own rather than reading .env.local or hitting the real API.
    env: { NEXT_PUBLIC_REGISTER_URL: "https://register.test/register" },
    // Console output plus a JUnit XML report (for CI tools that read JUnit).
    reporters: ["default", "junit"],
    outputFile: { junit: "test-results/junit.xml" },
  },
});
