import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import validPersonalityId from "./eslint-rules/valid-personality-id.js";

const local = {
  rules: {
    "valid-personality-id": validPersonalityId,
  },
};

export default defineConfig([
  js.configs.recommended,

  {
    files: ["**/*.js"],

    plugins: {
      local,
    },

    rules: {
      "local/valid-personality-id": "error",
    },

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
    },
  },
]);
