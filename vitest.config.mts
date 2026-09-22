import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    // Console output plus a JUnit XML report (for CI tools that read JUnit).
    reporters: ["default", "junit"],
    outputFile: { junit: "test-results/junit.xml" },
  },
});
