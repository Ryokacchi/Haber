// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    ignores: ["dist", "node_modules", "eslint.config.js"],
    rules: {
      "@typescript-eslint/no-invalid-void-type": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "quotes": ["error", "double"],
      "semi": ["error", "always"],
    },
  },
);