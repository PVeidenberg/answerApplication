module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
  rules: {
    "import/order": [
      "error",
      {
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
        },
      },
    ],
    "import/no-default-export": "error",
    // curly: ["error", "all"],
    //
    // // consider to turn on in the future
    // "@typescript-eslint/explicit-function-return-type": "off",
    // "@typescript-eslint/no-explicit-any": "off",
    //
    // used for code splitting
    //
    // // allow explicit unused variables
    // "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    //
    // // allow let for destructuring
    // "prefer-const": ["error", { destructuring: "all" }],
  },
  overrides: [
    {
      files: [".eslintrc.js", "server/**", "client/src/setupProxy.js"],
      env: {
        node: true,
      },
    },
    {
      files: "client/**",
      extends: ["react-app"],
    },
    {
      files: "*.js",
      rules: {
        "@typescript-eslint/no-var-requires": "off",
      },
    },
  ],
  ignorePatterns: ["node_modules/**", "client/build/**"],
};
