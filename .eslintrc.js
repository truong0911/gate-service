module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint/eslint-plugin"],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier/@typescript-eslint",
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: [".eslintrc.js"],
  rules: {
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "object-curly-spacing": "off",
    "@typescript-eslint/object-curly-spacing": ["error", "always"],
    "keyword-spacing": "off",
    "@typescript-eslint/keyword-spacing": ["error", { "after": true }],
    "semi": "off",
    "space-infix-ops": "off",
    "@typescript-eslint/space-infix-ops": ["error", { "int32Hint": false }],
    "@typescript-eslint/semi": ["error"],
    "quotes": "off",
    "@typescript-eslint/typedef": ["error", {
      "parameter": true
    }],
    "@typescript-eslint/quotes": ["error", "double"],
    "@typescript-eslint/no-floating-promises": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/require-await": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "comma-dangle": "off",
    "@typescript-eslint/comma-dangle": ["error", "always-multiline"],
    "@typescript-eslint/no-unsafe-member-access": "off",
    "object-curly-spacing": "off",
    "@typescript-eslint/object-curly-spacing": ["error", "always"],
    "eqeqeq": ["error", "always"],
    "no-trailing-spaces": "error",
    "no-multiple-empty-lines": ["error", { "max": 1 }],
    "max-classes-per-file": "error"
  },
};
