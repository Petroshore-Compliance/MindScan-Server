import globals from "globals";
import pluginJs from "@eslint/js";
import configPrettier from "eslint-config-prettier";

import pluginJest from "eslint-plugin-jest";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
    },
  },
  {
    languageOptions: {
      globals: globals.node,
    },
  },


  // --------------------------------------------
  // 2) Override for Test Files (Jest)
  // --------------------------------------------
  {
    // Match test files or directories as needed
    files: ["**/__tests__/**", "**/*.test.js", "**/*.spec.js"],
    languageOptions: {
      // Merge in or override with Jest globals
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    // Load the Jest plugin
    plugins: {
      jest: pluginJest,
    },
    // Merge Jest’s recommended rules
    rules: {
      ...pluginJest.configs.recommended.rules,
      // Optionally adjust severity levels, e.g.:
      "jest/no-disabled-tests": "warn",
      "jest/no-focused-tests": "warn",
    },
  },

  pluginJs.configs.recommended,
  configPrettier,
];
