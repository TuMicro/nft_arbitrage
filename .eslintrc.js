module.exports = {
    root: true,
    env: {
        // "browser": true,
        "es6": true,
        "node": true,
    },
    extends: [
        "eslint:recommended",
        "plugin:import/errors",
        "plugin:import/warnings",
        "plugin:import/typescript",
        // "google",
        "plugin:@typescript-eslint/recommended",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: ["tsconfig.json", "tsconfig.dev.json"],
        tsconfigRootDir: __dirname,
        sourceType: "module",
    },
    ignorePatterns: [
        "/lib/**/*", // Ignore built files.
        // '.eslintrc.js' // !!! new and important part !!!
    ],
    plugins: [
        "eslint-plugin-import",
        "@typescript-eslint",
        "@typescript-eslint/tslint",
        "import",
    ],
    rules: {
        "import/no-unresolved": 0,
        "@typescript-eslint/no-extra-semi": "warn",
        "@typescript-eslint/no-require-imports": "error", // required to deploy to Google Cloud Functions
        "@typescript-eslint/adjacent-overload-signatures": "error",
        "@typescript-eslint/no-empty-function": "error",
        "@typescript-eslint/no-empty-interface": "warn",
        "@typescript-eslint/no-floating-promises": "error",
        "@typescript-eslint/no-namespace": "error",
        "no-param-reassign": "error",
        "@typescript-eslint/no-shadow": [
            "error",
            {
                "hoist": "all"
            }
        ],
        "@typescript-eslint/no-unnecessary-type-assertion": "error",
        "@typescript-eslint/prefer-for-of": "warn",
        "@typescript-eslint/triple-slash-reference": "error",
        "@typescript-eslint/unified-signatures": "warn",
        "constructor-super": "error",
        "eqeqeq": [
            "warn",
            "smart"
        ],
        "import/no-deprecated": "warn",
        "import/no-extraneous-dependencies": "error",
        "import/no-unassigned-import": "warn",
        "no-cond-assign": "error",
        "no-duplicate-case": "error",
        "no-duplicate-imports": "error",
        "no-empty": [
            "error",
            {
                "allowEmptyCatch": true
            }
        ],
        "no-invalid-this": "error",
        "no-new-wrappers": "error",
        "no-redeclare": "error",
        "no-sequences": "error",
        "no-throw-literal": "error",
        "no-unsafe-finally": "error",
        "no-unused-labels": "error",
        "no-var": "error",
        "no-void": "error",
        "prefer-const": "error",
        "@typescript-eslint/restrict-template-expressions": [
            "error",
            {
                "allowNumber": true,
                "allowBoolean": false,
                "allowAny": false,
                "allowNullish": false
            },
        ],
        "@typescript-eslint/tslint/config": [
            "error",
            {
                "rules": {
                }
            }
        ]
    }
};
