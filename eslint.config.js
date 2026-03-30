import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      "react-hooks": reactHooks
    },
    ignores: ["**/*.js", "node_modules/**", "build/**", "dist/**", "tests/**", "src/tests/**", "src/jest.config.*", "src/lighthouse.config.js", "src/next.config.*"],
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "no-undef": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
      "no-useless-escape": "off",
      "no-case-declarations": "off",
      "preserve-caught-error": "off",
      "prefer-const": "off",
      "no-useless-assignment": "off",
      "react-hooks/exhaustive-deps": "off",
    }
  }
);