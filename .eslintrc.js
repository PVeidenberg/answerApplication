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
    "@typescript-eslint/no-explicit-any": "off",
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
